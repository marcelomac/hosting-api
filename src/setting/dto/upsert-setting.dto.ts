import { IsString, IsBoolean, IsInt, IsOptional } from 'class-validator';

export class UpsertSettingDto {
  @IsString()
  labelHtml: string;
}
