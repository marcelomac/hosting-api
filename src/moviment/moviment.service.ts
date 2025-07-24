import { Injectable } from '@nestjs/common';
import { CreateMovimentDto } from './dto/create-moviment.dto';
import { UpdateMovimentDto } from './dto/update-moviment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { formatISO, parseISO } from 'date-fns';
//import { getScriptsRelation } from '../script/helpers/getLdapScriptsRelation';
import { CreateOrdinanceDto } from 'src/ordinance/dto/create-ordinance.dto';
import { EmployeeService } from 'src/employee/employee.service';
import { DepartmentService } from 'src/department/department.service';
import { SysLogService } from 'src/syslog/syslog.service';
import * as dotenv from 'dotenv';
import { debugLog } from 'src/helpers/utils/debugLog';
import { OrdinanceService } from 'src/ordinance/ordinance.service';

dotenv.config();
@Injectable()
export class MovimentService {
  private readonly debug = process.env.DEBUG === 'true' ? true : false;
  constructor(
    private prisma: PrismaService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private sysLogService: SysLogService,
    private ordinanceService: OrdinanceService,
  ) {}

  async create(createMovimentDto: CreateMovimentDto) {
    const fixedMovimentDto = {
      ...createMovimentDto,
      date: formatISO(parseISO(createMovimentDto.date)),
    };

    if (
      createMovimentDto.number.length === 0 ||
      createMovimentDto.number === undefined
    ) {
      await this.getMovimentLastNumber().then((lastNumber) => {
        fixedMovimentDto.number = (lastNumber + 1).toString();
      });
    }

    try {
      return this.prisma.moviment.create({
        data: fixedMovimentDto,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(status?: string) {
    const response = await this.prisma.moviment.findMany({
      where: { status },
      include: {
        Employee: true,
        Department: true,
        Relationship: true,
        Ordinance: true,
      },
      orderBy: {
        number: 'desc',
      },
    });

    return response;
  }

  async findAllComposed() {
    const response = await this.prisma.moviment.findMany({
      include: {
        Employee: true,
      },
    });

    const composedMoviment = response.map((moviment) => {
      return {
        ...moviment,
        composedMoviment: `${moviment.number} - ${moviment.movimentType} - ${moviment.Employee.name}`,
      };
    });

    return composedMoviment;
  }

  async findMovimentById(id: string) {
    const response = await this.prisma.moviment.findUniqueOrThrow({
      where: { id },
      include: {
        Employee: true,
        Department: true,
        Relationship: true,
        Ordinance: true,
      },
    });

    return response;
  }

  async findByLastByEmployee(employeeId: string) {
    const response = await this.prisma.moviment.findFirst({
      where: { employeeId, status: 'Concluído' },
      orderBy: { date: 'desc' },
    });

    return response;
  }

  update(id: string, updateMovimentDto: UpdateMovimentDto) {
    const fixedMovimentDto = {
      ...updateMovimentDto,
      date: formatISO(parseISO(updateMovimentDto.date)),
    };

    return this.prisma.moviment.update({
      where: { id },
      data: fixedMovimentDto,
    });
  }

  updateStatus(id: string, status: string) {
    return this.prisma.moviment.update({
      where: { id },
      data: { status },
    });
  }

  remove(id: string) {
    return this.prisma.moviment.delete({
      where: { id },
    });
  }

  async getMovimentByStatus(status: string): Promise<CreateMovimentDto[]> {
    const moviments = await this.prisma.moviment.findMany({
      where: {
        status: status,
      },
      include: {
        Employee: true,
      },
    });

    const fixedMoviments = moviments.map((moviment) => {
      return {
        ...moviment,
        date: formatISO(new Date(moviment.date)),
        createdAt: formatISO(new Date(moviment.createdAt)),
      };
    });

    return fixedMoviments;
  }

  async getMovimentLastNumber(): Promise<number> {
    const response = await this.prisma.moviment.findFirst({
      select: {
        number: true,
      },
      orderBy: {
        number: 'desc',
      },
    });

    const currentYear = new Date().getFullYear().toString().slice(-2);

    if (!response) {
      return parseInt(`${currentYear}000`);
    }

    // Verifica se os dois primeiros dígitos do último número são iguais ao ano atual:
    const numberYear = response.number.toString().slice(0, 2);

    if (numberYear === currentYear) {
      return parseInt(response.number);
    } else {
      return parseInt(`${currentYear}000`);
    }
  }

  async createMovimentsByOrdinanceIds(ordinanceIds: string[]) {
    const ordinances = await this.prisma.ordinance.findMany({
      where: { id: { in: ordinanceIds } },
    });

    const fixedOrdinances = ordinances.map((ordinance) => {
      return {
        ...ordinance,
        publication: formatISO(new Date(ordinance.publication)),
        createdAt: formatISO(new Date(ordinance.createdAt)),
      };
    });

    // await new Promise((resolve) => setTimeout(resolve, 1000));

    const moviments =
      await this.createMovimentsFromPendingOrdinance(fixedOrdinances);

    return moviments;
  }

  async createMovimentsByOrdinanceStatus(status: string) {
    const ordinances = await this.prisma.ordinance.findMany({
      where: { status: status },
    });

    debugLog('ordinances: ', ordinances);

    const fixedOrdinances = ordinances.map((ordinance) => {
      return {
        ...ordinance,
        publication: formatISO(new Date(ordinance.publication)),
        createdAt: formatISO(new Date(ordinance.createdAt)),
      };
    });

    // await new Promise((resolve) => setTimeout(resolve, 1000));

    const moviments =
      await this.createMovimentsFromPendingOrdinance(fixedOrdinances);

    debugLog('moviments: ', moviments);

    return moviments;
  }

  /**
   * Formatação e criação dos registros de movimentação.
   *
   * Cria movimentos somente para portarias de ingresso e desligamento em que o funcionário exista.
   * Não cria movimentos para portarias cujos números já existam no banco de dados.
   * Não cria movimentos para portarias de nomeações e exonerações que sejam do mesmo funcionário, mesmo tipo de movimento e da mesma data.
   */
  async createMovimentsFromPendingOrdinance(ordinances: CreateOrdinanceDto[]) {
    try {
      let lastNumber = await this.getMovimentLastNumber();

      // sort ordinancesImport by number
      ordinances.sort((a, b) => {
        return a.number.localeCompare(b.number);
      });

      // Percorre as portarias passadas por parâmetro e cria as movimentações
      const promises = ordinances.map(async (ordinance) => {
        // Verifica se a portaria é de ingresso ou desligamento e se o nome do funcionário não está vazio
        if (
          ordinance.status === 'Pendente' &&
          (ordinance.employeeId || ordinance.employeeName.length > 0)
        ) {
          let employeeId = '';

          if (!ordinance.employeeId) {
            // Busca os dados do funcionário pelo nome
            const employee = await this.employeeService.findByName(
              ordinance.employeeName,
            );
            employeeId = employee ? employee.id : '';
          } else {
            employeeId = ordinance.employeeId;
          }

          //const department = null;
          let departmentId = '';

          if (!ordinance.departmentId) {
            // Busca os dados do departamento pelo nome
            const department = await this.departmentService.findByName(
              ordinance.departmentName,
            );
            departmentId = department ? department.id : '';
          } else {
            departmentId = ordinance.departmentId;
          }

          // let department = null;
          // if (ordinance.departmentName.length > 0) {
          //   department = await this.departmentService.findByName(
          //     ordinance.departmentName,
          //   );
          // }

          // // Busca os dados do funcionário pelo nome similar
          // const employee = await this.employeeService.findBySimilarName(
          //   ordinance.employeeName,
          // );

          // // Busca os dados do departamento pelo nome similar
          // let department = null;
          // if (ordinance.departmentName.length > 0) {
          //   department = await this.departmentService.findBySimilarName(
          //     ordinance.departmentName,
          //   );
          // }

          // Verifica se o funcionário foi encontrado
          if (employeeId) {
            ///debugLog('employee.similar.id', employee!.id);

            // Para a portaria sendo analisada, verifica se existe outra de ingresso ou desligamento
            // do mesmo funcionário, mesmo tipo de movimento e mesma data
            const alreadyExistsSimilarOrdinance = ordinances.find(
              (ordinanceSearch) =>
                (ordinanceSearch.ordinanceType === 'Nomeação' ||
                  ordinanceSearch.ordinanceType === 'Exoneração') &&
                ordinance.number !== ordinanceSearch.number &&
                ordinance.employeeName === ordinanceSearch.employeeName &&
                ordinance.departmentName === ordinanceSearch.departmentName &&
                ordinance.publication === ordinanceSearch.publication,
            );

            // Se não existir uma portaria similar, cria a movimentação
            if (!alreadyExistsSimilarOrdinance) {
              const nextNumber = ++lastNumber;
              debugLog('nextNumber: ', nextNumber);

              // const lastMoviment = await this.findByLastByEmployee(
              //   employee!.id,
              // );

              const relationshipId = null;
              // let relationshipId = null;
              // if (lastMoviment) {
              //   relationshipId = lastMoviment.relationshipId;
              // }

              await this.ordinanceService.updateStatus(
                ordinance.id,
                'Movimento Gerado',
              );
              return {
                number: nextNumber.toString(),
                ordinanceId: ordinance.id,
                employeeId: employeeId,
                departmentId:
                  departmentId.trim().length > 0 ? departmentId : null,
                relationshipId: relationshipId || null,
                status: 'Pendente', // Pendente, Revisado, Scripts gerados, success_script, sent_email, Cancelado
                date: new Date(),
                origin: 'API',
                movimentType: ordinance.ordinanceType,
              };
            } else {
              await this.ordinanceService.updateStatus(
                ordinance.id,
                'Ignorado',
              );
              debugLog(
                'alreadyExistsSimilarOrdinance: ',
                alreadyExistsSimilarOrdinance,
              );
            }
          }
        }
      });

      // variable moviments receive the result of the promises
      //let createdMoviments = await Promise.all(promises);

      //let totalMoviments = typeof this.prisma.moviment;
      // Aguarda a resolução de todas as promises
      const createdMoviments = Promise.all(promises)
        .then(async (moviments) =>
          moviments.filter((moviment) => moviment !== undefined),
        )
        .then(async (moviments) => {
          return await this.prisma.moviment.createManyAndReturn({
            data: moviments.flat(),
            skipDuplicates: true,
          });
        });

      /** Grava o log da execução da rotina */
      const countMoviments = (await createdMoviments).length;
      await this.sysLogService.createSysLog({
        action: 'API-Geração de Movimentações',
        message: ` ${countMoviments} movimentações gravadas.`,
        file: 'moviment.service.ts',
      });

      // Retorna as movimentações criadas

      debugLog('createdMoviments: ', createdMoviments);
      return createdMoviments;

      // Registra log de erro:
    } catch (error) {
      await this.sysLogService.createSysLog({
        action: 'API-Geração de Movimentações',
        message: `Erro: ${error}.`,
        file: 'moviment.service.ts',
      });

      throw new Error(error);
    }
  }
}
