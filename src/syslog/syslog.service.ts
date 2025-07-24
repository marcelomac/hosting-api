import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface iSysLog {
  action: string;
  message: string;
  file: string;
}

@Injectable()
export class SysLogService {
  constructor(private prisma: PrismaService) {}

  async createSysLog({ action, message, file }: iSysLog) {
    return this.prisma.sysLog.create({
      data: {
        action,
        message,
        file,
      },
    });
  }

  async findAll() {
    const response = await this.prisma.sysLog.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return response;
  }

  async findOne(id: string) {
    const response = await this.prisma.sysLog.findUniqueOrThrow({
      where: { id },
    });

    return response;
  }
}
