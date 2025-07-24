import {
  IsString,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateMovimentDto {
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
  @IsOptional()
  compliance: boolean;
}
