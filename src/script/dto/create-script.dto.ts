import {
  IsString,
  IsDateString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateScriptDto {
  @IsString()
  @IsNotEmpty()
  movimentId: string;

  @IsString()
  @IsNotEmpty()
  templateId: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  scriptContent: string;

  @IsString()
  @IsOptional()
  emailContent: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsDateString()
  @IsNotEmpty()
  statusDate: string;

  @IsString()
  @IsNotEmpty()
  scriptType: string;

  @IsString()
  @IsOptional()
  annotation: string;
}
