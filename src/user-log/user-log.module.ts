import { Module } from '@nestjs/common';
import { UserLogService } from './user-log.service';

@Module({
  providers: [UserLogService]
})
export class UserLogModule {}
