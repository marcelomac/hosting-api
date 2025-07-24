import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('authenticate')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async authenticate(@Body() body: { login: string; password: string }) {
    return {
      token: await this.authService.authenticate(body.login, body.password),
    };
  }
}
