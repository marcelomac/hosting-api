import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { CronjobService } from 'src/cronjob/cronjob.service';

@Module({
  controllers: [SettingController],
  providers: [SettingService, CronjobService],
})
export class SettingModule {}
