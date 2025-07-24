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
        ordinanceStartDateConfig: 'lastFetch',
        ordinanceStartDaysBefore: 0,
        movimentCreateToIngress: false,
        movimentCreateToDismissal: false,
        movimentCreateToStartVacation: false,
        movimentCreateToEndVacation: false,
        movimentCreateToStartLicense: false,
        movimentCreateToEndLicense: false,
        movimentCreateToStartSuspension: false,
        movimentCreateToEndSuspension: false,
        keywordsToIngress: '',
        keywordsToDismissal: '',
        keywordsToStartVacation: '',
        keywordsToEndVacation: '',
        keywordsToStartLicense: '',
        keywordsToEndLicense: '',
        keywordsToStartSuspension: '',
        keywordsToEndSuspension: '',
        scriptRemovePendingBeforeCreate: false,
        scriptCreateAfterRevisedMoviment: false,
        scriptExecuteRequestAfterCreate: false,
        scriptExecuteWebscrapingAfterCreate: false,
        scriptExecuteCreateEmailAfterCreate: false,
        scriptExecuteEmailSendAfterCreate: false,
        robotFetchOrdinanceActiveSchedule: false,
        robotFetchOrdinanceScheduleContent: '',
        robotActionsActiveSchedule: false,
        robotActionsScheduleContent: '',
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

    const oldRobotFetchOrdinanceScheduleContent =
      setting?.robotFetchOrdinanceScheduleContent || '';

    const id = setting?.id || createRandomString(10);

    await this.prismaService.setting.upsert({
      where: { id: id },
      create: upsertSettingDto,
      update: upsertSettingDto,
    });

    if (
      oldRobotFetchOrdinanceScheduleContent.trim() !=
      upsertSettingDto.robotFetchOrdinanceScheduleContent.trim()
    ) {
      // this.cronJobService.deleteCronJob('testCron');
      // this.cronJobService.addCron(
      //   'testCron',
      //   setting?.robotFetchOrdinanceScheduleContent,
      // );
      // this.cronJobService.deleteCronJob('fetchOrdinance');
      // this.cronJobService.addCronJob(
      //   'fetchOrdinance',
      //   setting?.robotFetchOrdinanceScheduleContent,
      // );
    }
  }

  async patchSetting(field: string, value: string) {
    const setting = await this.prismaService.setting.findFirst();

    const data = { [field]: value };

    console.log('data: ', data);

    await this.prismaService.setting.update({
      where: { id: setting.id },
      data: data,
    });
  }
}
