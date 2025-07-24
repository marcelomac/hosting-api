import { Module } from '@nestjs/common';
import { MovimentService } from './moviment.service';
import { MovimentController } from './moviment.controller';
import { EmployeeService } from 'src/employee/employee.service';
import { DepartmentService } from 'src/department/department.service';
import { SysLogService } from 'src/syslog/syslog.service';
import { OrdinanceService } from 'src/ordinance/ordinance.service';
import { ScriptService } from 'src/script/script.service';
import { TemplateService } from 'src/template/template.service';
import { EmailService } from 'src/email/email.service';
import { SettingService } from 'src/setting/setting.service';
import { CronjobService } from 'src/cronjob/cronjob.service';

@Module({
  controllers: [MovimentController],
  providers: [
    MovimentService,
    EmployeeService,
    DepartmentService,
    SysLogService,
    OrdinanceService,
    ScriptService,
    TemplateService,
    EmailService,
    SettingService,
    CronjobService,
  ],
})
export class MovimentModule {}
