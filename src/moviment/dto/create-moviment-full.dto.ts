import {
  IsString,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { CreateDepartmentDto } from 'src/department/dto/create-department.dto';
import { CreateRelationshipDto } from 'src/relationship/dto/create-relationship.dto';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';

export class CreateMovimentFullDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsOptional()
  ordinanceId: string;

  @IsString()
  @IsOptional()
  departmentId: string;

  @IsString()
  @IsOptional()
  relationshipId: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  movimentType: string;

  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsOptional()
  annotation: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsBoolean()
  @IsNotEmpty()
  compliance: boolean;

  @IsDateString()
  createdAt: string;

  Employee: CreateEmployeeDto;
  Department: CreateDepartmentDto;
  Relationship: CreateRelationshipDto;
  // Ordinance: CreateOrdinanceDto;
}
