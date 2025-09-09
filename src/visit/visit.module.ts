import { Module } from '@nestjs/common';
import { VisitService } from './visit.service';
import { VisitController } from './visit.controller';
import { PersonService } from 'src/person/person.service';
import { DepartmentService } from 'src/department/department.service';
import { SysLogService } from 'src/syslog/syslog.service';

@Module({
  controllers: [VisitController],
  providers: [
    VisitService,
    PersonService,
    DepartmentService,
    SysLogService,
  ],
})
export class VisitModule {}
