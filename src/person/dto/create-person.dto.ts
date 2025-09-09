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
  @IsNotEmpty()
  sex: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  birthdate: string;
}
