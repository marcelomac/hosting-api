import { Controller, Get, Body, Patch, Query } from '@nestjs/common';
import { SettingService } from './setting.service';

import { UpsertSettingDto } from './dto/upsert-setting.dto';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  getAllSetting() {
    return this.settingService.getAllSetting();
  }

  @Patch('all')
  update(@Body() settingDto: UpsertSettingDto) {
    return this.settingService.update(settingDto);
  }

  @Patch('field')
  patchSetting(@Query('field') field: string, @Query('value') value: string) {
    return this.settingService.patchSetting(field, value);
  }
}
