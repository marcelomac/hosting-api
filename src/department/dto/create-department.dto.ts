import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDepartmentDto {
  /**
   * Em vez de anotar manualmente cada propriedade, considere usar o plug-in Swagger
   * (consulte a seção Plug-in ), que fornecerá isso automaticamente para você.
   * https://docs.nestjs.com/openapi/cli-plugin
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  responsibleName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;


  @ApiProperty()
  @IsString()
  @IsOptional()
  phone1: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone2: string;

  @IsBoolean()
  active: boolean = true;
}
