import { Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResourceService {
  constructor(private prisma: PrismaService) {}

  create(createResourceDto: CreateResourceDto) {
    return this.prisma.resource.create({
      data: createResourceDto,
    });
  }

  async findAll() {
    const response = await this.prisma.resource.findMany({
      orderBy: { name: 'asc' },
    });

    return response;
  }

  async findOne(id: string) {
    const response = await this.prisma.resource.findUniqueOrThrow({
      where: { id },
    });

    return response;
  }

  update(id: string, updateResourceDto: UpdateResourceDto) {
    return this.prisma.resource.update({
      where: { id },
      data: updateResourceDto,
    });
  }

  remove(id: string) {
    return this.prisma.resource.delete({
      where: { id },
    });
  }
}
