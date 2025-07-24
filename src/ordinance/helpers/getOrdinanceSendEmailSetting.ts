import { UpsertSettingDto } from 'src/setting/dto/upsert-setting.dto';

export async function getOrdinanceSendEmailSetting(setting: UpsertSettingDto) {
  const ordinanceSendEmailSetting: string[] = [];

  if (setting.ordinanceSendEmailToIngress) {
    ordinanceSendEmailSetting.push('Nomeação');
  }
  if (setting.ordinanceSendEmailToDismissal) {
    ordinanceSendEmailSetting.push('Exoneração');
  }
  if (setting.ordinanceSendEmailToStartVacation) {
    ordinanceSendEmailSetting.push('Início de férias');
  }
  if (setting.ordinanceSendEmailToEndVacation) {
    ordinanceSendEmailSetting.push('Retorno de férias');
  }
  if (setting.ordinanceSendEmailToStartLicense) {
    ordinanceSendEmailSetting.push('Início de licença');
  }
  if (setting.ordinanceSendEmailToEndLicense) {
    ordinanceSendEmailSetting.push('Retorno de licença');
  }
  if (setting.ordinanceSendEmailToStartSuspension) {
    ordinanceSendEmailSetting.push('Início de suspensão');
  }
  if (setting.ordinanceSendEmailToEndSuspension) {
    ordinanceSendEmailSetting.push('Retorno de suspensão');
  }

  return ordinanceSendEmailSetting.join(', ');
}
