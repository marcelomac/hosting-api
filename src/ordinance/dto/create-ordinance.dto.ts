import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrdinanceDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsDateString()
  @IsNotEmpty()
  publication: string;

  @IsString()
  @IsNotEmpty()
  ordinanceType: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsOptional()
  @IsString()
  employeeName: string;

  @IsOptional()
  @IsString()
  departmentName: string;

  @IsOptional()
  @IsString()
  employeeId: string;

  @IsOptional()
  @IsString()
  departmentId: string;

  @IsOptional()
  @IsString()
  link: string;
}
