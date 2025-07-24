import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { SysLogService } from 'src/syslog/syslog.service';
import { SettingService } from 'src/setting/setting.service';
import { CronjobService } from 'src/cronjob/cronjob.service';
import { MovimentService } from 'src/moviment/moviment.service';
import { EmployeeService } from 'src/employee/employee.service';
import { DepartmentService } from 'src/department/department.service';
import { OrdinanceService } from 'src/ordinance/ordinance.service';

@Module({
  controllers: [EmailController],
  providers: [
    EmailService,
    SysLogService,
    SettingService,
    CronjobService,
    MovimentService,
    EmployeeService,
    DepartmentService,
    OrdinanceService,
  ],
})
export class EmailModule {}
