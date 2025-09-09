import {
  IsString,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateVisitDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  personId: string;

  @IsString()
  @IsOptional()
  departmentId: string;

  @IsDateString()
  @IsNotEmpty()
  dateTime: string;

  @IsString()
  @IsOptional()
  notes: string;

}
