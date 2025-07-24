import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { join } from 'node:path';
import * as dotenv from 'dotenv';
import { UpdateProfileDto } from './dto/update-profile.dto';

dotenv.config();
interface IPayload {
  sub: string;
}

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async createProfile(user: IPayload): Promise<CreateProfileDto> {
    return this.prisma.profile.create({
      data: {
        userId: user.sub,
        theme: 'light',
        avatarUrl: '',
        openTableFilter: false,
      },
    });
  }

  async getProfile(user: IPayload): Promise<CreateProfileDto> {
    const { sub: userId } = user as IPayload;
    const response = await this.prisma.profile.findUnique({
      where: { userId: userId },
    });

    return response;
  }

  async getAvatar(user: IPayload) {
    const { sub: userId } = user as IPayload;
    const response = await this.prisma.profile.findUniqueOrThrow({
      where: { userId: userId },
      select: { avatarUrl: true },
    });

    const serverUrl = process.env.SERVER_URL;

    const imagePath = join(
      serverUrl,
      __dirname,
      '..',
      '..',
      'uploads',
      'avatars',
      response?.avatarUrl,
    );
    return imagePath;
  }

  update(user: IPayload, updateProfileDto: UpdateProfileDto) {
    const { sub: userId } = user as IPayload;
    return this.prisma.profile.update({
      where: { userId },
      data: updateProfileDto,
    });
  }
}
