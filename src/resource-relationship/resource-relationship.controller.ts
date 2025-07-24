import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ResourceRelationshipService } from './resource-relationship.service';
import { CreateResourceRelationshipDto } from './dto/create-resource-relationship.dto';
import { UpdateResourceRelationshipDto } from './dto/update-resource-relationship.dto';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/user/user.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('resource-relationship')
@Role(Roles.ADMIN)
@UseGuards(JwtGuard, RoleGuard)
export class ResourceRelationshipController {
  constructor(
    private readonly resourceRelationshipService: ResourceRelationshipService,
  ) {}

  @Post()
  create(@Body() createResourceRelationshipDto: CreateResourceRelationshipDto) {
    return this.resourceRelationshipService.create(
      createResourceRelationshipDto,
    );
  }

  @Get()
  findAll() {
    return this.resourceRelationshipService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourceRelationshipService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResourceRelationshipDto: UpdateResourceRelationshipDto,
  ) {
    return this.resourceRelationshipService.update(
      id,
      updateResourceRelationshipDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourceRelationshipService.remove(id);
  }
}
