import { Module } from '@nestjs/common';
import { SysLogService } from './syslog.service';
import { SyslogController } from './syslog.controller';

@Module({
  providers: [SysLogService],
  controllers: [SyslogController],
})
export class SysLogModule {}
