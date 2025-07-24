import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Department } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

export interface IQueryDepartmentParams {
  page?: string;
  perPage?: string;
}

export interface SimilarDepartment {
  similar: Department;
  similarity: number;
}

const trigram_pg_similarity_departmentName =
  parseFloat(process.env.TRIGRAM_PG_SIMILARITY_DEPARTMENTNAME) || 0.3;

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  create(createDepartmentDto: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: createDepartmentDto,
    });
  }

  async findAll() {
    const response = await this.prisma.department.findMany({
      orderBy: { name: 'asc' },
    });

    return response;
  }

  async findOne(id: string) {
    const response = await this.prisma.department.findUniqueOrThrow({
      where: { id },
    });

    return response;
  }

  async findByName(name: string) {
    const response = await this.prisma.department.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (!response) {
      return null;
    }

    return response;
  }

  async findBySimilarName(name: string): Promise<Department | null> {
    // Query personalizada para usar a função similarity do PostgreSQL
    const SimilarDepartment = await this.prisma.$queryRaw<SimilarDepartment>`
    SELECT *, similarity(name, ${name})
    FROM "Department"
    ORDER BY similarity(name, ${name}) DESC
    LIMIT 1;
  `;

    if (SimilarDepartment.similarity < trigram_pg_similarity_departmentName) {
      return null;
    }

    // console.log('devolve o nome mais similar: ', SimilarDepartment[0]);
    return SimilarDepartment[0];
  }

  update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    return this.prisma.department.update({
      where: { id },
      data: updateDepartmentDto,
    });
  }

  remove(id: string) {
    return this.prisma.department.delete({
      where: { id },
    });
  }
}
