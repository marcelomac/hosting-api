import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UserLogService } from 'src/user-log/user-log.service';

@Injectable()
export class UserLogMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userLogService: UserLogService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const userId = await this.authService.getUserIdFromToken(token);
      const { method, originalUrl } = req;
      this.userLogService.createUserLog(userId, method, originalUrl);
    }

    next();
  }
}
