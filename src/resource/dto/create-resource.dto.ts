import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  active?: boolean = true;
}
