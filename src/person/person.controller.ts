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

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  @Get()
  findAll() {
    return this.personService.findAll();
  }

  @Get('name')
  findByName(@Body() body: { name: string }) {
    if (body.name) {
      return this.personService.findByName(body.name);
    }
    return null;
  }

  @Get('last')
  findLastCreated() {
    return this.personService.findLastCreated();
  }

  @Get(':id')
  findPersonById(@Param('id') id: string) {
    if (id) {
      return this.personService.findPersonById(id);
    }
    return null;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(id, updatePersonDto);
  }

  @Delete(':id')
  @HttpCode(204) // No content
  remove(@Param('id') id: string) {
    return this.personService.remove(id);
  }
}
