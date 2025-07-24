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
  folderPath: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  instructions: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  ldapGroupName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  ldapGroupOU: string;

  @IsBoolean()
  active: boolean = true;
}
