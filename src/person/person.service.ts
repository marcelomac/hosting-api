import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseISO, formatISO } from 'date-fns';
import * as dotenv from 'dotenv';

import { Person } from '@prisma/client';
import { debugLog } from 'src/helpers/utils/debugLog';

dotenv.config();
export interface SimilarPerson {
  data: Person;
  similarity: number;
}

export interface IQueryPersonParams {
  id?: string;
}

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  async create(createPersonDto: CreatePersonDto) {
    const person = await this.prisma.person.create({
      data: createPersonDto,
    });

    return person;
  }

  
  async findAll() {
    const response = await this.prisma.person.findMany({
      orderBy: { name: 'asc' },
    });

    return response;
  }

  async findPersonById(id: string) {
    const response = await this.prisma.person.findUniqueOrThrow({
      where: { id },
    });
    return response;
  }

  async findByName(name: string) {
    const person = await this.prisma.person.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (!person) {
      return null;
    }

    console.log('person.data: ', person.name);

    return person;
  }

  
  update(id: string, updatePersonDto: UpdatePersonDto) {
    return this.prisma.person.update({
      where: { id },
      data: updatePersonDto,
    });
  }

  remove(id: string) {
    return this.prisma.person.delete({
      where: { id },
    });
  }
}
