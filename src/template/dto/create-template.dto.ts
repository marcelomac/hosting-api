import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  order: number;

  @IsString()
  @IsNotEmpty()
  resourceId: string;

  @IsString()
  @IsNotEmpty()
  movimentType: string;

  @IsString()
  @IsNotEmpty()
  scriptType: string;

  @IsString()
  @IsNotEmpty()
  scriptContent: string;

  @IsString()
  @IsOptional()
  emailContent: string;

  @IsNotEmpty()
  @IsBoolean()
  sendEmail: boolean;
}
