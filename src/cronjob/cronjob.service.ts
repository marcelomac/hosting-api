import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
//import { CronJob } from 'cron';
import { CronTime } from 'cron';
import { debugLog } from 'src/helpers/utils/debugLog';
import { SettingService } from 'src/setting/setting.service';

@Injectable()
// export class CronjobService implements OnApplicationBootstrap {
//   onApplicationBootstrap() {
//     this.checkInitialJobs();
//   }
//   constructor(
//     private schedulerRegistry: SchedulerRegistry,
//     private settingService: SettingService,
//   ) {}
export class CronjobService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private settingService: SettingService,
  ) {}

  /**
 
  * * * * * * *
  | | | | | |
  | | | | | day of week
  | | | | months
  | | | day of month
  | | hours
  | minutes
  seconds (optional)

*/

  // async checkInitialJobs() {
  //   const robotFetchOrdinanceActiveSchedule =
  //     await this.settingService.getSetting('robotFetchOrdinanceActiveSchedule');

  //   console.log(
  //     'robotFetchOrdinanceActiveSchedule: ',
  //     robotFetchOrdinanceActiveSchedule,
  //   );

  //   if (robotFetchOrdinanceActiveSchedule !== null) {
  //     this.startJob('cron-fetch-ordinance');
  //   }

  //   const robotActionsActiveSchedule = await this.settingService.getSetting(
  //     'robotActionsActiveSchedule',
  //   );

  //   if (robotActionsActiveSchedule !== null) {
  //     this.startJob('cron-robot-actions');
  //   }
  // }

  setTimeJob(name: string, time: string) {
    const job = this.schedulerRegistry.getCronJob(name);

    const cronTime = new CronTime(time);
    job.setTime(cronTime);
  }

  startJob(name: string) {
    const job = this.schedulerRegistry.getCronJob(name);
    job.start();
  }

  stopJob(name: string) {
    const job = this.schedulerRegistry.getCronJob(name);
    job.stop();
  }

  nextDate(name: string) {
    const job = this.schedulerRegistry.getCronJob(name);
    debugLog(
      'job.nextDate().toLocaleString():',
      job.nextDate().toLocaleString(),
    );
    return job.nextDate().toJSDate();
  }

  deleteCronJob(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
  }

  validateCronJob(schedule: string) {
    console.log(schedule);
    // CronJob.vali isValidCronTime(schedule);
    return true;
  }
}
