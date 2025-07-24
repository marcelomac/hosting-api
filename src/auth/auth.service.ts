import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedError } from './errors/unauthorized.error';
import { Roles, UserService } from 'src/user/user.service';
import { createRandomString } from 'src/helpers/utils/createRandomString';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async authenticate(login: string, password: string) {
    let token = '';

    if (
      login === process.env.DEFAULT_USER_LOGIN &&
      password == process.env.DEFAULT_USER_PASSWORD
    ) {
      const payload = {
        name: login,
        sub: createRandomString(10),
        role: Roles.ADMIN,
      };

      console.log('1-payload: ', payload);

      // cria e assina o token que será retornado para o cliente:
      token = this.jwtService.sign(payload);

      console.log('2-token: ', token);
    } else {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { login },
      });

      console.log('3-user: ', user);

      if (!user) {
        throw new UnauthorizedError('Login e/ou senha inválidos.');
      }

      const passwordMatch = bcrypt.compareSync(password, user.password);

      console.log('4-passwordMatch: ', passwordMatch);

      if (!passwordMatch) {
        throw new UnauthorizedError('Login e/ou senha inválidos.');
      }

      // cria o profile do usuário, se ele não existir:
      const profile = await this.prisma.profile.findUnique({
        where: { userId: user.id },
      });

      if (!profile) {
        await this.prisma.profile.create({
          data: {
            userId: user.id,
            theme: 'light',
            avatarUrl: ' ',
          },
        });
      }

      // cria o payload do token:
      const payload = {
        name: user.name,
        sub: user.id,
        role: user.role,
      };

      console.log('5-payload: ', payload);
      // cria e assina o token que será retornado para o cliente:
      token = this.jwtService.sign(payload);
    }

    return token;
  }

  async validateUser(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      // Aqui você pode adicionar lógica para buscar o usuário do banco de dados usando o ID decodificado
      // Exemplo:
      const user = await this.userService.findUserById(decoded.sub);
      if (!user) {
        throw new UnauthorizedError('Invalid token');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedError('Invalid token');
    }
  }

  async getUserIdFromToken(token: string) {
    const decoded = await this.jwtService.verify(token);
    return decoded.sub;
  }
}
