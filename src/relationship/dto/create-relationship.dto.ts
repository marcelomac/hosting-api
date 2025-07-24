import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRelationshipDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  active: boolean;
}
