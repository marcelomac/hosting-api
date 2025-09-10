import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  documentType: string;

  @IsString()
  @IsOptional()
  documentNumber: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  subTitle: string;

  @IsString()
  @IsNotEmpty()
  sex: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  email: string;
}
