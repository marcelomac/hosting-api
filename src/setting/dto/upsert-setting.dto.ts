import { IsString, IsBoolean, IsInt, IsOptional } from 'class-validator';

export class UpsertSettingDto {
  @IsString()
  ordinanceStartDateConfig: string = 'lastFetch';

  @IsInt()
  @IsOptional()
  ordinanceStartDaysBefore: number = 3;

  @IsBoolean()
  ordinanceSendEmailToIngress: boolean = false;

  @IsBoolean()
  ordinanceSendEmailToDismissal: boolean = false;

  @IsBoolean()
  ordinanceSendEmailToStartVacation: boolean = false;

  @IsBoolean()
  ordinanceSendEmailToEndVacation: boolean = false;

  @IsBoolean()
  ordinanceSendEmailToStartLicense: boolean = false;

  @IsBoolean()
  ordinanceSendEmailToEndLicense: boolean = false;

  @IsBoolean()
  ordinanceSendEmailToStartSuspension: boolean = false;

  @IsBoolean()
  ordinanceSendEmailToEndSuspension: boolean = false;

  @IsString()
  @IsOptional()
  ordinanceSendEmailDestiny: string;

  @IsBoolean()
  movimentCreateToIngress: boolean = false;

  @IsBoolean()
  movimentCreateToDismissal: boolean = false;

  @IsBoolean()
  movimentCreateToStartVacation: boolean = false;

  @IsBoolean()
  movimentCreateToEndVacation: boolean = false;

  @IsBoolean()
  movimentCreateToStartLicense: boolean = false;

  @IsBoolean()
  movimentCreateToEndLicense: boolean = false;

  @IsBoolean()
  movimentCreateToStartSuspension: boolean = false;

  @IsBoolean()
  movimentCreateToEndSuspension: boolean = false;

  @IsString()
  @IsOptional()
  keywordsToIngress: string;

  @IsString()
  @IsOptional()
  keywordsToDismissal: string;

  @IsString()
  @IsOptional()
  keywordsToStartVacation: string;

  @IsString()
  @IsOptional()
  keywordsToEndVacation: string;

  @IsString()
  @IsOptional()
  keywordsToStartLicense: string;

  @IsString()
  @IsOptional()
  keywordsToEndLicense: string;

  @IsString()
  @IsOptional()
  keywordsToStartSuspension: string;

  @IsString()
  @IsOptional()
  keywordsToEndSuspension: string;

  @IsBoolean()
  scriptRemovePendingBeforeCreate: boolean = false;

  @IsBoolean()
  scriptCreateAfterRevisedMoviment: boolean = false;

  @IsBoolean()
  scriptExecuteRequestAfterCreate: boolean = false;

  @IsBoolean()
  scriptExecuteWebscrapingAfterCreate: boolean = false;

  @IsBoolean()
  scriptExecuteCreateEmailAfterCreate: boolean = false;

  @IsBoolean()
  scriptExecuteEmailSendAfterCreate: boolean = false;

  @IsBoolean()
  robotFetchOrdinanceActiveSchedule: boolean = false;

  @IsString()
  @IsOptional()
  robotFetchOrdinanceScheduleContent?: string;

  @IsBoolean()
  robotActionsActiveSchedule: boolean = false;

  @IsString()
  @IsOptional()
  robotActionsScheduleContent?: string;
}
