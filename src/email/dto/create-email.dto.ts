import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateEmailDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  scriptId: string;

  @IsString()
  @IsNotEmpty()
  movimentId: string;

  @IsString()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsOptional()
  cc: string;

  @IsString()
  @IsOptional()
  cco: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsOptional()
  preview: string;

  @IsDateString()
  @IsOptional()
  text: string;

  @IsString()
  @IsOptional()
  html: string;

  @IsDateString()
  @IsOptional()
  sentAt: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  uniqueKey: string;
}
