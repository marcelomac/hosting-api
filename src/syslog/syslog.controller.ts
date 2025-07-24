import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/user/user.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { SysLogService } from './syslog.service';

@Role(Roles.ADMIN)
@UseGuards(JwtGuard, RoleGuard)
@Controller('syslog')
export class SyslogController {
  constructor(private readonly syslogService: SysLogService) {}

  @Get()
  findAll() {
    return this.syslogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.syslogService.findOne(id);
  }
}
