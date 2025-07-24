import { Module } from '@nestjs/common';
import { OrdinanceService } from './ordinance.service';
import { OrdinanceController } from './ordinance.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SysLogService } from 'src/syslog/syslog.service';
import { SettingService } from 'src/setting/setting.service';
import { CronjobService } from 'src/cronjob/cronjob.service';
import { EmployeeService } from 'src/employee/employee.service';
import { DepartmentService } from 'src/department/department.service';

@Module({
  controllers: [OrdinanceController],
  providers: [
    PrismaService,
    OrdinanceService,
    SysLogService,
    SettingService,
    CronjobService,
    EmployeeService,
    DepartmentService,
  ],
})
export class OrdinanceModule {}
