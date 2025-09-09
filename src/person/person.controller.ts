import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/user/user.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }


  @Get()
  @Role(Roles.USER)
  @UseGuards(JwtGuard, RoleGuard)
  findAll() {
    return this.personService.findAll();
  }

  @Get('name')
  @Role(Roles.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  findByName(@Body() body: { name: string }) {
    if (body.name) {
      return this.personService.findByName(body.name);
    }
    return null;
  }

  
  @Get(':id')
  @Role(Roles.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  findPersonById(@Param('id') id: string) {
    if (id) {
      return this.personService.findPersonById(id);
    }
    return null;
  }

  @Patch(':id')
  @Role(Roles.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  update(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    return this.personService.update(id, updatePersonDto);
  }

  @Delete(':id')
  @Role(Roles.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(204) // No content
  remove(@Param('id') id: string) {
    return this.personService.remove(id);
  }
}
