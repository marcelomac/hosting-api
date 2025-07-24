import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseISO, formatISO } from 'date-fns';
import * as dotenv from 'dotenv';

import { Employee } from '@prisma/client';
import { debugLog } from 'src/helpers/utils/debugLog';

dotenv.config();
export interface SimilarEmployee {
  data: Employee;
  similarity: number;
}

export interface IQueryEmployeeParams {
  id?: string;
}

const trigram_pg_similarity_employeeName =
  parseFloat(process.env.TRIGRAM_PG_SIMILARITY_EMPLOYEENAME) || 0.3;

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const fixedEmployeeDto = {
      ...createEmployeeDto,
      birthdate: createEmployeeDto.birthdate
        ? formatISO(parseISO(createEmployeeDto.birthdate))
        : null,
    };

    const employee = await this.prisma.employee.create({
      data: fixedEmployeeDto,
    });

    return employee;
  }

  async createWithMoviment({ employeeData, movimentData }) {
    try {
      debugLog('createEmployeeDto: ', employeeData);
      debugLog('createMovimentDto: ', movimentData);

      const fixedemployeeData = {
        ...employeeData,
        birthdate: employeeData.birthdate
          ? formatISO(parseISO(employeeData.birthdate))
          : null,
      };

      // Cria o funcionário
      const newEmployee = await this.prisma.employee.create({
        data: fixedemployeeData,
      });

      movimentData.employeeId = newEmployee.id;

      // Busca o último número de movimento
      const lastMovimentNumber = await this.prisma.moviment.findFirst({
        select: {
          number: true,
        },
        orderBy: {
          number: 'desc',
        },
      });

      const currentYear = new Date().getFullYear().toString().slice(-2);

      const nextMovimentNumber = !lastMovimentNumber
        ? parseInt(`${currentYear}001`)
        : parseInt(lastMovimentNumber.number) + 1;

      movimentData.number = nextMovimentNumber.toString();

      // Cria o movimento
      await this.prisma.moviment.create({
        data: movimentData,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll1() {
    const response = await this.prisma.employee.findMany({
      orderBy: { name: 'asc' },
    });

    return response;
  }

  /**
   * Consulta com relacionamento com a tabela Moviment
   * Retorna o último movimento de cada funcionário e se ele está ativo ou não
   * (se o último movimento for uma Nomeação, o funcionário está ativo)
   * (se o último movimento for uma Exoneração, o funcionário não está ativo)
   * (se não houver movimento, retorna null)
   */
  async findAll(): Promise<Employee[] | null> {
    const employees = await this.prisma.$queryRaw<Employee[]>`
      SELECT *,  
        (SELECT 
          CASE WHEN m."movimentType" = 'Nomeação' THEN 'Sim'
              WHEN m."movimentType" = 'Exoneração' THEN 'Não'
          END 
          FROM "Moviment" m
          WHERE m.number = (SELECT MAX(m2.number) FROM "Moviment" m2 WHERE (m2."employeeId"  = m."employeeId") AND (m2.status = 'Concluído') AND ((m2."movimentType" = 'Nomeação') OR (m2."movimentType" = 'Exoneração')) GROUP BY m2."employeeId")
              AND (m."employeeId" = e.id)
              AND (m.status = 'Concluído')
          LIMIT 1
        ) AS active,
        (SELECT 
          r.name
          FROM "Moviment" m LEFT JOIN "Relationship" r ON m."relationshipId" = r."id"
          WHERE m.number = (SELECT MAX(m2.number) FROM "Moviment" m2 WHERE (m2."employeeId"  = m."employeeId") AND (m2.status = 'Concluído') AND ((m2."movimentType" = 'Nomeação') OR (m2."movimentType" = 'Exoneração')) GROUP BY m2."employeeId")
              AND (m."employeeId" = e.id)
              AND (m.status = 'Concluído')
          LIMIT 1
        ) AS last_relationship,        
        (SELECT 
          d.name
          FROM "Moviment" m LEFT JOIN "Department" d ON m."departmentId" = d."id"
          WHERE m.number = (SELECT MAX(m2.number) FROM "Moviment" m2 WHERE (m2."employeeId"  = m."employeeId") AND (m2.status = 'Concluído') AND ((m2."movimentType" = 'Nomeação') OR (m2."movimentType" = 'Exoneração')) GROUP BY m2."employeeId")
              AND (m."employeeId" = e.id)
              AND (m.status = 'Concluído')
          LIMIT 1
        ) AS last_department
      FROM "Employee" e
      ORDER BY e.name;
  `;
    return employees;
  }

  async findEmployeeById(id: string) {
    const response = await this.prisma.employee.findUniqueOrThrow({
      where: { id },
    });
    return response;
  }

  async findByName(name: string) {
    const employee = await this.prisma.employee.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (!employee) {
      return null;
    }

    console.log('employee.data: ', employee.name);

    return employee;
  }

  /**
   * pg_trgm — support for similarity of text using trigram matching
   * doc: https://www.postgresql.org/docs/current/pgtrgm.html
   *
   * CREATE EXTENSION pg_trgm;
   *
   * SET pg_trgm.similarity_threshold = 0.3;
   * => Define o limite de similaridade atual usado pelo operador %. O limite deve
   *    estar entre 0 e 1 (o padrão é 0,3).
   */

  async findBySimilarName(name: string): Promise<Employee | null> {
    // Query personalizada para usar a função similarity do PostgreSQL
    const SimilarEmployee = await this.prisma.$queryRaw<SimilarEmployee>`
    SELECT *, similarity(name, ${name})
    FROM "Employee"
    ORDER BY similarity(name, ${name}) DESC
    LIMIT 1;
  `;

    debugLog('SimilarEmployee[0].similarity: ', SimilarEmployee[0].similarity);
    debugLog(
      'trigram_pg_similarity_employeeName: ',
      trigram_pg_similarity_employeeName,
    );

    if (
      SimilarEmployee[0].similarity >= 0 &&
      trigram_pg_similarity_employeeName &&
      SimilarEmployee[0].similarity < trigram_pg_similarity_employeeName
    ) {
      return null;
    }

    //console.log('devolve o nome mais similar: ', SimilarEmployee[0]);
    return SimilarEmployee[0];
  }

  async findEmployeeByCpf(cpf: string) {
    const response = await this.prisma.employee.findUnique({
      where: { cpf },
    });
    return response;
  }

  update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const fixedEmployeeDto = {
      ...updateEmployeeDto,
      birthdate: updateEmployeeDto.birthdate
        ? formatISO(parseISO(updateEmployeeDto.birthdate))
        : null,
    };

    return this.prisma.employee.update({
      where: { id },
      data: fixedEmployeeDto,
    });
  }

  remove(id: string) {
    return this.prisma.employee.delete({
      where: { id },
    });
  }
}
