import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/user/user.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('template')
@Role(Roles.ADMIN)
@UseGuards(JwtGuard, RoleGuard)
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templateService.create(createTemplateDto);
  }

  @Get()
  findAll() {
    return this.templateService.findAll();
  }

  @Get('last-order')
  async getLastTemplateOrder(@Query('movimentType') movimentType: string) {
    const result =
      await this.templateService.getLastTemplateOrder(movimentType);

    if (!result) return 0;

    return result.order;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templateService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return this.templateService.update(id, updateTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templateService.remove(id);
  }

  @Get('findAllByRelationshipAndMovimentType')
  findAllByRelationshipAndMovimentType(
    @Query('relationshipId') relationshipId: string,
    @Query('movimentType') movimentType: string,
  ) {
    return this.templateService.findAllByRelationshipAndMovimentType(
      relationshipId,
      movimentType,
    );
  }
}
