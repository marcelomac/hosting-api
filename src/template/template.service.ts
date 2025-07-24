import { Injectable } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TemplateService {
  constructor(private prisma: PrismaService) {}

  create(createTemplateDto: CreateTemplateDto) {
    try {
      return this.prisma.template.create({
        data: createTemplateDto,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    const response = await this.prisma.template.findMany({
      include: {
        Resource: true,
      },
      orderBy: { order: 'asc' },
    });

    // const templates = flattenJson(response);

    return response;
  }

  async getLastTemplateOrder(movimentType: string) {
    const response = await this.prisma.template.findFirst({
      select: { order: true },
      where: {
        movimentType,
      },
      orderBy: {
        order: 'desc',
      },
    });

    return response;
  }

  async findAllByRelationshipAndMovimentType(
    relationshipId: string,
    movimentType: string,
  ) {
    const resources = await this.prisma.resourceRelationship.findMany({
      select: { resourceId: true },
      where: { relationshipId, active: true },
    });

    const resourcesIds = resources.map((item) => item.resourceId);

    const templates = await this.prisma.template.findMany({
      where: {
        movimentType,
        resourceId: { in: resourcesIds },
      },
      orderBy: {
        order: 'asc',
      },
    });

    //const templates = response.flat();
    return templates;
  }

  async findOne(id: string) {
    const response = await this.prisma.template.findUniqueOrThrow({
      include: {
        Resource: true,
      },
      where: { id },
    });
    return response;
  }

  update(id: string, updateTemplateDto: UpdateTemplateDto) {
    return this.prisma.template.update({
      where: { id },
      data: updateTemplateDto,
    });
  }

  remove(id: string) {
    return this.prisma.template.delete({
      where: { id },
    });
  }
}
