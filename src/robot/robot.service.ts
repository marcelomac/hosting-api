import { Injectable, Logger } from '@nestjs/common';
import { formatISO } from 'date-fns';
import { MovimentService } from 'src/moviment/moviment.service';
import { OrdinanceService } from 'src/ordinance/ordinance.service';
import { ScriptService } from 'src/script/script.service';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SettingService } from 'src/setting/setting.service';
import { Cron } from '@nestjs/schedule';
import { SysLogService } from 'src/syslog/syslog.service';
import { getFormattedTime } from 'src/helpers/utils/getFormattedTime';
import { getOrdinanceSendEmailSetting } from 'src/ordinance/helpers/getOrdinanceSendEmailSetting';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class RobotService {
  private readonly debug = process.env.DEBUG === 'true' ? true : false;

  constructor(
    private prismaService: PrismaService,
    private ordinanceService: OrdinanceService,
    private movimentService: MovimentService,
    private scriptService: ScriptService,
    private emailService: EmailService,
    private settingService: SettingService,
    private sysLogService: SysLogService,
    private readonly logger: Logger, // instantiate logger
  ) {}

  SERVICE: string = 'FetchOrdinanceService';

  /**
   * Rotina de atualização geral:
   * 1. Busca as portarias no site do DOM no período informado e gera movimentos para cada portaria encontrada.
   * 2. Cria scripts para movimentos com status "Revisado".
   * 3. Executa os scripts dos tipos "Requisição de API", "send-email" e Webscraping com status "Pendente".
   * 4. Verifica se os scripts foram executados com sucesso e envia e-mail para o servidor.
   */

  @Cron('* * 31 12 *', {
    name: 'cron-robot-services',
    disabled: true,
  })
  async callServices() {
    let messageLog = getFormattedTime('hh:mm') + 'Iniciou a execução.';
    //await this.callFetchOrdinance();

    messageLog =
      messageLog +
      '\n' +
      getFormattedTime('hh:mm') +
      '-Chamando rotina:  createMovimentsByOrdinanceStatus("Pendente").';
    await this.movimentService.createMovimentsByOrdinanceStatus('Pendente');

    messageLog =
      messageLog +
      '\n' +
      getFormattedTime('hh:mm') +
      '-Chamando rotina:  createScriptByMovimentStatus("Revisado").';
    await this.scriptService.createScriptByMovimentStatus('Revisado');

    const setting = await this.settingService.getAllSetting();

    if (setting.scriptExecuteRequestAfterCreate) {
      console.log('Executando scripts de requisição de API...');
    }
    if (setting.scriptExecuteWebscrapingAfterCreate) {
      console.log('Executando scripts de Webscraping...');
    }
    if (setting.scriptExecuteEmailSendAfterCreate) {
      console.log('Executando scripts de envio de e-mail...');
    }

    //await this.scriptService.executeScriptByPendingStatus();

    // Busca todos os movimentos com status 'Scripts gerados' para que o serviço
    // de envio de e-mail possa ser executado.
    messageLog =
      messageLog +
      '\n' +
      getFormattedTime('hh:mm') +
      '-Chamando rotina:  getMovimentByStatus("Scripts gerados").';
    const moviments =
      await this.movimentService.getMovimentByStatus('Scripts gerados');

    if (!moviments) {
      messageLog =
        messageLog +
        '\n' +
        getFormattedTime('hh:mm') +
        '-Finalizando execução: Não retornou movimentos com status "Scripts gerados".';
      return;
    }

    const movimentIds = moviments.map((moviment) => moviment.id);

    messageLog =
      messageLog +
      '\n' +
      getFormattedTime('hh:mm') +
      `-Movimentos retornados: ${movimentIds}.`;

    messageLog =
      messageLog +
      '\n' +
      getFormattedTime('hh:mm') +
      '-Chamando rotina: createMailToEmployeeByMoviment(movimentIds).';
    await this.emailService.createMailToEmployeeByMoviment(movimentIds);

    messageLog =
      messageLog +
      '\n' +
      getFormattedTime('hh:mm') +
      'Chamando rotina: createMailToEmployeeByMoviment(movimentIds).';
    await this.emailService.createMailToEmployeeByMoviment(movimentIds);

    /** Grava o log da execução da rotina */
    this.sysLogService.createSysLog({
      action: 'API-Execução de rotinas de atualização geral',
      message: messageLog,
      file: 'robot.service.ts | callServices()',
    });
  }

  /**
   * Busca as portarias no site do Diário Oficial dos Municípios no período informado e
   * gera movimentos para cada portaria encontrada.
   */

  @Cron('* * 31 12 *', {
    name: 'cron-fetch-ordinance',
    disabled: true,
  })
  async callFetchOrdinance(
    dataInicial?: string,
    dataFinal?: string,
    number?: string,
    searchType?: string,
  ) {
    try {
      let messageLog = getFormattedTime('hh:mm') + 'Iniciou a execução.';
      //await this.callFetchOrdinance();
      this.logger.log(
        `Call fetch ordinance - ${dataInicial} to ${dataFinal}`,
        this.SERVICE,
      );

      messageLog =
        messageLog +
        '\n' +
        getFormattedTime('hh:mm') +
        `Chamando rotina:  fetchOrdinance(${dataInicial}, ${dataFinal}).`;
      const ordinances = await this.ordinanceService.fetchOrdinance(
        dataInicial,
        dataFinal,
        number,
        searchType,
      );

      if (!ordinances) {
        messageLog =
          messageLog +
          '\n' +
          getFormattedTime('hh:mm') +
          'Finalizando execução: Não retornou portarias.';
        return;
      }

      const fixedOrdinances = ordinances?.map((ordinance) => {
        return {
          ...ordinance,
          publication: formatISO(new Date(ordinance.publication)),
          createdAt: formatISO(new Date(ordinance.createdAt)),
        };
      });

      messageLog =
        messageLog +
        '\n' +
        getFormattedTime('hh:mm') +
        `Retornou:  ${fixedOrdinances.length} portarias.`;

      messageLog =
        messageLog +
        '\n' +
        getFormattedTime('hh:mm') +
        `Chamando rotina:  createMovimentsFromPendingOrdinance(fixedOrdinances).`;

      await this.movimentService.createMovimentsFromPendingOrdinance(
        fixedOrdinances,
      );

      const setting = await this.settingService.getAllSetting();

      const ordinanceSendEmailSetting =
        await getOrdinanceSendEmailSetting(setting);

      if (fixedOrdinances.length > 0) {
        const newOrdinances = [];
        fixedOrdinances.forEach((ordinance) => {
          if (ordinanceSendEmailSetting.includes(ordinance.ordinanceType)) {
            newOrdinances.push(ordinance);
          }
        });

        if (newOrdinances.length > 0) {
          newOrdinances.forEach((ordinance) => {
            this.emailService.sendMail(
              setting.ordinanceSendEmailDestiny,
              'Nova portaria cadastrada',
              `Nova(s) portaria(s) cadastrada(s): \n\n ${ordinance.number} - ${ordinance.ordinanceType} - ${ordinance.employeeName}\n`,
            );
          });
        }
      }

      /** Grava o log da execução da rotina */
      this.sysLogService.createSysLog({
        action: 'API-Busca de portarias no site do DOM',
        message: messageLog,
        file: 'robot.service.ts | callFetchOrdinance()',
      });

      return fixedOrdinances;
    } catch (error) {
      /** Grava o log da execução da rotina */
      this.sysLogService.createSysLog({
        action: 'API-Busca de portarias no site do DOM',
        message: 'Erro: ' + error,
        file: 'robot.service.ts | callFetchOrdinance()',
      });
      this.logger.error(
        `Error fetching ordinance - ${error.stack}`,
        this.SERVICE,
      );
    }
  }

  /**
   * Cria scripts para movimentos com status "Revisado".
   */
  async callCreateScript() {
    const result = await this.prismaService.moviment.findMany({
      select: { id: true },
      where: { status: 'Revisado' },
    });

    const movimentIds = result.map((moviment) => moviment.id);

    const scripts =
      await this.scriptService.createScriptByMovimentIds(movimentIds);

    const fixedScripts = scripts.map((script) => {
      return {
        ...script,
        statusDate: formatISO(script.statusDate.toISOString()),
      };
    });

    this.scriptService.saveLdapScriptsToFile(fixedScripts);

    return [
      {
        message: `${scripts.length} scripts criados`,
      },
    ];
  }

  /**
   * Executa os scripts dos tipos "Requisição de API", "send-email" e Webscraping com status "Pendente".
   */
  async callExecuteScript() {
    this.scriptService.executeScriptByStatus();
  }

  /**
   * Verifica se os scripts foram executados com sucesso e envia e-mail para o servidor.
   */
  async callVerifyScript() {
    this.scriptService.verifyScript();
  }
}
