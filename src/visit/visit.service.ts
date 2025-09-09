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
    const fixedVisitDto = {
      ...createVisitDto,
      date: formatISO(parseISO(createVisitDto.date)),
    };

    try {
      return this.prisma.visit.create({
        data: fixedVisitDto,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    const response = await this.prisma.visit.findMany({
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
      },
    });

    return response;
  }

  update(id: string, updateVisitDto: UpdateVisitDto) {
    const fixedVisitDto = {
      ...updateVisitDto,
      date: formatISO(parseISO(updateVisitDto.date)),
    };

    return this.prisma.visit.update({
      where: { id },
      data: fixedVisitDto,
    });
  }

  remove(id: string) {
    return this.prisma.visit.delete({
      where: { id },
    });
  }
}
