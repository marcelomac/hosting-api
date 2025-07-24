import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CronjobService } from './cronjob.service';

@Controller('cronjob')
export class CronjobController {
  constructor(private readonly cronjobService: CronjobService) {}

  @Post('set-time')
  setTimeJob(@Body() body: { name: string; cronTime: string }) {
    console.log('body.name: ', body.name);
    console.log('body.cronTime: ', body.cronTime);

    return this.cronjobService.setTimeJob(body.name, body.cronTime);
  }

  @Patch('start-job')
  startJob(@Query('name') name: string) {
    return this.cronjobService.startJob(name);
  }

  @Patch('stop-job')
  stopJob(@Query('name') name: string) {
    return this.cronjobService.stopJob(name);
  }

  @Get('next-date')
  nextDate(@Query('name') name: string) {
    return this.cronjobService.nextDate(name);
  }

  // @Get('validate-cron-job')
  // validateCronJob(@Param('name') name: string) {
  //   return this.cronjobService.validateCronJob(schedule);
  // }

  @Delete('delete-cron-job')
  deleteCronJob(@Param('name') name: string) {
    return this.cronjobService.deleteCronJob(name);
  }
}
