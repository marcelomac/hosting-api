import { Logger, Module } from '@nestjs/common';
import { RobotController } from './robot.controller';
import { RobotService } from './robot.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SysLogService } from 'src/syslog/syslog.service';
import { OrdinanceService } from 'src/ordinance/ordinance.service';
import { MovimentService } from 'src/moviment/moviment.service';
import { EmployeeService } from 'src/employee/employee.service';
import { DepartmentService } from 'src/department/department.service';
import { ScriptService } from 'src/script/script.service';
import { TemplateService } from 'src/template/template.service';
import { RelationshipService } from 'src/relationship/relationship.service';
import { ResourceService } from 'src/resource/resource.service';
import { EmailService } from 'src/email/email.service';
import { SettingService } from 'src/setting/setting.service';
import { CronjobService } from 'src/cronjob/cronjob.service';

@Module({
  controllers: [RobotController],
  providers: [
    PrismaService,
    RobotService,
    OrdinanceService,
    EmployeeService,
    MovimentService,
    DepartmentService,
    TemplateService,
    RelationshipService,
    ResourceService,
    SysLogService,
    ScriptService,
    EmailService,
    Logger,
    SettingService,
    CronjobService,
  ],
})
export class RobotModule {}
