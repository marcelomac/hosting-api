import { Injectable } from '@nestjs/common';
import { CreateResourceRelationshipDto } from './dto/create-resource-relationship.dto';
import { UpdateResourceRelationshipDto } from './dto/update-resource-relationship.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResourceRelationshipService {
  constructor(private prisma: PrismaService) {}

  create(createResourceRelationshipDto: CreateResourceRelationshipDto) {
    return this.prisma.resourceRelationship.create({
      data: createResourceRelationshipDto,
    });
  }

  findAll() {
    const response = this.prisma.resourceRelationship.findMany({
      include: {
        Resource: true,
        Relationship: true,
      },
      orderBy: {
        Relationship: {
          name: 'asc',
        },
      },
    });

    return response;
  }

  findOne(id: string) {
    const response = this.prisma.resourceRelationship.findUniqueOrThrow({
      where: { id },
      include: {
        Resource: true,
        Relationship: true,
      },
    });

    return response;
  }

  update(
    id: string,
    updateResourceRelationshipDto: UpdateResourceRelationshipDto,
  ) {
    return this.prisma.resourceRelationship.update({
      where: { id },
      data: updateResourceRelationshipDto,
    });
  }

  remove(id: string) {
    return this.prisma.resourceRelationship.delete({
      where: { id },
    });
  }
}
