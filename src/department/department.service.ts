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
