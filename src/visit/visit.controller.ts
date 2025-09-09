import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { VisitService } from './visit.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/user/user.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { debugLog } from 'src/helpers/utils/debugLog';

@Controller('visit')
@Role(Roles.ADMIN)
@UseGuards(JwtGuard, RoleGuard)
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @Post()
  create(@Body() createVisitDto: CreateVisitDto) {
    return this.visitService.create(createVisitDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitService.findVisitById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVisitDto: UpdateVisitDto,
  ) {
    return this.visitService.update(id, updateVisitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitService.remove(id);
  }

}
