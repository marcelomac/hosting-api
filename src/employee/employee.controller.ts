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
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/user/user.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { CreateMovimentDto } from 'src/moviment/dto/create-moviment.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Post('with-moviment')
  @Role(Roles.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  createWithMoviment(
    @Body()
    body: {
      employeeData: CreateEmployeeDto;
      movimentData: CreateMovimentDto;
    },
  ) {
    return this.employeeService.createWithMoviment(body);
  }

  @Get()
  @Role(Roles.USER)
  @UseGuards(JwtGuard, RoleGuard)
  findAll() {
    return this.employeeService.findAll();
  }

  @Get('name')
  @Role(Roles.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  findByName(@Body() body: { name: string }) {
    if (body.name) {
      return this.employeeService.findByName(body.name);
    }
    return null;
  }

  @Get('similar-name')
  @Role(Roles.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async findBySimilarName(@Body() body: { name: string }) {
    if (body.name) {
      return await this.employeeService.findBySimilarName(body.name);
    }
    return null;
  }

  @Get(':id')
  @Role(Roles.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  findEmployeeById(@Param('id') id: string) {
    if (id) {
      return this.employeeService.findEmployeeById(id);
    }
    return null;
  }

  @Get('/cpf/:cpf')
  findEmployeeByCpf(@Param('cpf') cpf: string) {
    if (cpf) {
      return this.employeeService.findEmployeeByCpf(cpf);
    }
    return null;
  }

  @Patch(':id')
  @Role(Roles.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Role(Roles.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(204) // No content
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
