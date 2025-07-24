import { Module } from '@nestjs/common';
import { CronjobService } from './cronjob.service';
import { CronjobController } from './cronjob.controller';
import { SettingService } from 'src/setting/setting.service';

@Module({
  providers: [CronjobService, SettingService],
  controllers: [CronjobController],
})
export class CronjobModule {}
