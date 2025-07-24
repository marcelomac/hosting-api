import { Injectable } from '@nestjs/common';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RelationshipService {
  constructor(private prisma: PrismaService) {}

  create(createRelationshipDto: CreateRelationshipDto) {
    return this.prisma.relationship.create({
      data: createRelationshipDto,
    });
  }

  async findAll() {
    const response = await this.prisma.relationship.findMany({
      orderBy: { name: 'asc' },
    });

    return response;
  }

  async findOne(id: string) {
    const response = await this.prisma.relationship.findUniqueOrThrow({
      where: { id },
    });

    return response;
  }

  update(id: string, updateRelationshipDto: UpdateRelationshipDto) {
    return this.prisma.relationship.update({
      where: { id },
      data: updateRelationshipDto,
    });
  }

  remove(id: string) {
    return this.prisma.relationship.delete({
      where: { id },
    });
  }
}
