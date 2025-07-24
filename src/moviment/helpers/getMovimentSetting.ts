import { UpsertSettingDto } from 'src/setting/dto/upsert-setting.dto';

export async function getMovimentSetting(setting: UpsertSettingDto) {
  const movimentSetting: string[] = [];

  if (setting.movimentCreateToIngress) {
    movimentSetting.push('Nomeação');
  }
  if (setting.movimentCreateToDismissal) {
    movimentSetting.push('Exoneração');
  }
  if (setting.movimentCreateToStartVacation) {
    movimentSetting.push('Início de férias');
  }
  if (setting.movimentCreateToEndVacation) {
    movimentSetting.push('Retorno de férias');
  }
  if (setting.movimentCreateToStartLicense) {
    movimentSetting.push('Início de licença');
  }
  if (setting.movimentCreateToEndLicense) {
    movimentSetting.push('Retorno de licença');
  }
  if (setting.movimentCreateToStartSuspension) {
    movimentSetting.push('Início de suspensão');
  }
  if (setting.movimentCreateToEndSuspension) {
    movimentSetting.push('Retorno de suspensão');
  }

  return movimentSetting.join(', ');
}
