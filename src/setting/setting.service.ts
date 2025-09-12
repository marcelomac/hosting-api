import { Injectable } from '@nestjs/common';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createRandomString } from 'src/helpers/utils/createRandomString';

@Injectable()
export class SettingService {
  constructor(private prismaService: PrismaService) {}

  async createAllsetting() {
    const setting = await this.prismaService.setting.create({
      data: {
        labelHtml: '',
      },
    });

    return setting;
  }

  async getAllSetting() {
    let setting = await this.prismaService.setting.findFirst();

    if (!setting) {
      setting = await this.createAllsetting();
    }
    return setting;
  }

  async update(settingDto: UpsertSettingDto) {
    const setting = await this.prismaService.setting.findFirst();

    await this.prismaService.setting.update({
      where: { id: setting.id },
      data: settingDto,
    });
  }

  async getSetting(key: string) {
    const setting = await this.prismaService.setting.findFirst();

    if (!setting) {
      const settingValue = setting[key];

      switch (typeof settingValue) {
        case 'string':
          return '';
        case 'number':
          return 0;
        case 'boolean':
          return false;
      }
    } else {
      return setting[key];
    }
  }

  async upsert(upsertSettingDto: UpsertSettingDto) {
    const setting = await this.getAllSetting();

    const id = setting?.id || createRandomString(10);

    await this.prismaService.setting.upsert({
      where: { id: id },
      create: upsertSettingDto,
      update: upsertSettingDto,
    });
  }

  async patchSetting(field: string, value: string) {
    const setting = await this.prismaService.setting.findFirst();
    const data = { [field]: value };

    await this.prismaService.setting.update({
      where: { id: setting.id },
      data: data,
    });
  }
}
