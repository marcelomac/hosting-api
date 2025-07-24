import { Module } from '@nestjs/common';
import { ScriptService } from './script.service';
import { MovimentService } from 'src/moviment/moviment.service';
import { ScriptController } from './script.controller';
import { SysLogService } from 'src/syslog/syslog.service';
import { EmployeeService } from 'src/employee/employee.service';
import { DepartmentService } from 'src/department/department.service';
import { TemplateService } from 'src/template/template.service';
import { RelationshipService } from 'src/relationship/relationship.service';
import { ResourceService } from 'src/resource/resource.service';
import { OrdinanceService } from 'src/ordinance/ordinance.service';
import { EmailService } from 'src/email/email.service';
import { SettingService } from 'src/setting/setting.service';
import { CronjobService } from 'src/cronjob/cronjob.service';

@Module({
  providers: [
    ScriptService,
    MovimentService,
    SysLogService,
    EmployeeService,
    DepartmentService,
    TemplateService,
    RelationshipService,
    ResourceService,
    OrdinanceService,
    EmailService,
    SettingService,
    CronjobService,
  ],
  controllers: [ScriptController],
})
export class ScriptModule {}
