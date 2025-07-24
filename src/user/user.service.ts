import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { ProfileService } from 'src/profile/profile.service';
import * as dotenv from 'dotenv';

dotenv.config();

export enum Roles {
  ADMIN = 'Administrador',
  REVISER = 'Revisor',
  USER = 'Usuário',
}

export const LevelRoles = {
  Administrador: 3,
  Revisor: 2,
  Usuário: 1,
};

async function hashPassword(password: string) {
  try {
    const saltRounds = parseInt(process.env.SALT_ROUNDS_PASSWORD) || 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    console.error('Hashing error:', error);
    throw error;
  }
}

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private profile: ProfileService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await hashPassword(createUserDto.password);

    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    await this.profile.createProfile({ sub: user.id });

    return user;
  }

  async findUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll() {
    const response = await this.prisma.user.findMany({
      orderBy: { name: 'asc' },
    });

    return response;
  }

  async findOne(id: string) {
    const response = await this.prisma.user.findUniqueOrThrow({
      where: { id },
    });

    delete response.password;

    return response;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
