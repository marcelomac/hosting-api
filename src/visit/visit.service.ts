import { Injectable } from '@nestjs/common';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { formatISO, parseISO } from 'date-fns';
//import { getScriptsRelation } from '../script/helpers/getLdapScriptsRelation';
import { DepartmentService } from 'src/department/department.service';
import { SysLogService } from 'src/syslog/syslog.service';
import * as dotenv from 'dotenv';
import { debugLog } from 'src/helpers/utils/debugLog';
import { PersonService } from 'src/person/person.service';
import { format } from 'date-fns';

dotenv.config();
@Injectable()
export class VisitService {
  private readonly debug = process.env.DEBUG === 'true' ? true : false;
  constructor(
    private prisma: PrismaService,
    private personService: PersonService,
    private departmentService: DepartmentService,
    private sysLogService: SysLogService,
  ) {}

  async create(createVisitDto: CreateVisitDto) {
    try {
      const fixedVisitDto = {
        ...createVisitDto,
        date: formatISO(parseISO(createVisitDto.date)),
      };

      const { id } = await this.prisma.visit.create({
        data: fixedVisitDto,
      });

      const visit = await this.findVisitById(id);

      await this.sysLogService.createSysLog({
        action: 'Cadastro de visita',
        message: `Data/hora do registro: ${visit.createdAt} |
          Data/hora da visita: ${format(visit.date, 'dd/MM/yyyy')}-${visit.timeIn} |
          Pessoa: ${visit.Person.name} | 
          Destino: ${visit.Department.name} | 
          Usuário: ${visit.User.id} - ${visit.User.name} |
          visitId: ${visit.id}`,
        file: 'visit',
      });

      return visit;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    const response = await this.prisma.visit.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        Person: true,
        Department: true,
      },
    });

    return response;
  }

  async findVisitById(id: string) {
    const response = await this.prisma.visit.findUniqueOrThrow({
      where: { id },
      include: {
        Person: true,
        Department: true,
        User: true,
      },
    });

    return response;
  }

  async update(id: string, updateVisitDto: UpdateVisitDto) {
    const fixedVisitDto = {
      ...updateVisitDto,
      date: formatISO(parseISO(updateVisitDto.date)),
    };

    try {
      await this.prisma.visit.update({
        where: { id },
        data: fixedVisitDto,
      });

      const updatedVisit = await this.findVisitById(fixedVisitDto.id);

      await this.sysLogService.createSysLog({
        action: 'Alteração de visita',
        message: `Data/hora do registro: ${updatedVisit.updatedAt} |
          Data/hora da visita: ${format(updatedVisit.date, 'dd/MM/yyyy')}-${updatedVisit.timeIn} |
          Pessoa: ${updatedVisit.Person.name} | 
          Destino: ${updatedVisit.Department.name} | 
          Usuário: ${updatedVisit.User.id} - ${updatedVisit.User.name} |
          visitId: ${updatedVisit.id}`,
        file: 'visit',
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  remove(id: string) {
    return this.prisma.visit.delete({
      where: { id },
    });
  }
}
