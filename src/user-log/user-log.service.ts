import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserLogService {
  constructor(private prisma: PrismaService) {}

  async createUserLog(user: User, action: string, message: string) {
    const userId = user ? user.id : null;
    await this.prisma.userLog.create({
      data: {
        userId,
        action,
        message,
      },
    });
  }
}
