import fs from 'fs';
import { parse } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { MovimentService } from 'src/moviment/moviment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScriptDto } from './dto/create-script.dto';
import { SysLogService } from 'src/syslog/syslog.service';
import { TemplateService } from 'src/template/template.service';
import { getScriptContent } from './helpers/getScriptContent';
import { formatISO, parseISO } from 'date-fns';
import { UpdateScriptDto } from './dto/update-script.dto';
import { CreateMovimentFullDto } from 'src/moviment/dto/create-moviment-full.dto';
import { debugLog } from 'src/helpers/utils/debugLog';
import { EmailService } from 'src/email/email.service';
import { fixDateType } from 'src/helpers/database/fixDateType';
import { SettingService } from 'src/setting/setting.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ScriptService {
  constructor(
    private prismaService: PrismaService,
    private movimentService: MovimentService,
    private templateService: TemplateService,
    private sysLogService: SysLogService,
    private settingService: SettingService,
    private emailService: EmailService,
  ) {}

  create(createScriptDto: CreateScriptDto) {
    const fixedScriptDto = {
      ...createScriptDto,
      statusDate: formatISO(parseISO(createScriptDto.statusDate)),
    };

    try {
      return this.prismaService.script.create({
        data: fixedScriptDto,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(filterName?: string, filterValue?: string) {
    const where = {
      include: {
        Moviment: {
          include: {
            Employee: true,
            Relationship: true,
          },
        },
        Template: {
          include: {
            Resource: true,
          },
        },
      },
    };

    // Filtra por nome e valor do campo passado como parâmetro na URL.
    if (filterName != 'undefined' && filterValue != 'undefined') {
      Object.assign(where, { where: { [filterName]: filterValue } });
    }

    let response = await this.prismaService.script.findMany({
      ...where,
      orderBy: [{ Moviment: { number: 'desc' } }, { number: 'asc' }],
    });

    response = response.map((script) => {
      return {
        ...script,
        employeeName: script.Moviment.Employee.name,
      };
    });

    return response;
  }

  async findScriptById(id: string) {
    const response = await this.prismaService.script.findUniqueOrThrow({
      where: { id },
      include: {
        Moviment: true,
        Template: true,
      },
    });

    return response;
  }

  update(id: string, updateScriptDto: UpdateScriptDto) {
    const fixedScriptDto = {
      ...updateScriptDto,
      statusDate: formatISO(parseISO(updateScriptDto.statusDate)),
    };

    return this.prismaService.script.update({
      where: { id },
      data: fixedScriptDto,
    });
  }

  updateStatus(id: string, status: string) {
    return this.prismaService.script.update({
      where: { id },
      data: { status },
    });
  }

  remove(id: string) {
    return this.prismaService.script.delete({
      where: { id },
    });
  }

  async removeAllPendingScriptsByMovimentId(movimentIds: string[]) {
    return await this.prismaService.script.deleteMany({
      where: { movimentId: { in: movimentIds }, status: 'Pendente' },
    });
  }

  async getScriptByStatus(status: string): Promise<CreateScriptDto[]> {
    const scripts = await this.prismaService.script.findMany({
      where: {
        status: status,
      },
      orderBy: {
        number: 'asc',
      },
    });

    // const fixedScripts = fixDateType(scripts);
    const fixedScripts = scripts.map((script) => {
      return {
        ...script,
        statusDate: formatISO(new Date(script.statusDate)),
        createdAt: formatISO(new Date(script.createdAt)),
      };
    });

    debugLog('fixedScripts: ', fixedScripts);
    return fixedScripts;
  }

  getScriptAndResource(status: string) {
    const scriptAndResource = this.prismaService.script.findMany({
      select: {
        id: true,
        number: true,
        Template: {
          select: {
            Resource: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      where: {
        status: status,
      },
      orderBy: {
        number: 'asc',
      },
    });

    return scriptAndResource;
  }

  // formatScriptNumber(movimentNumber: string, scriptNumber: number): string {
  //   const result = `${movimentNumber}.${scriptNumber.toString().padStart(3, '0')}`;
  //   return result;
  // }

  async createScriptByMovimentIds(movimentIds: string[]) {
    const moviments = await this.prismaService.moviment.findMany({
      where: { id: { in: movimentIds }, status: 'Revisado' },
      include: {
        Employee: true,
        Department: true,
        Relationship: true,
      },
    });

    const fixedMoviments = moviments.map((moviment) =>
      fixDateType(moviment),
    ) as CreateMovimentFullDto[];

    // const fixedMoviments = moviments.map((moviment) => {
    //   return {
    //     ...moviment,
    //     date: formatISO(new Date(moviment.date)) as string,
    //     statusDate: formatISO(new Date(moviment.statusDate)) as string,
    //     createdAt: formatISO(new Date(moviment.createdAt)) as string,
    //     Employee: {
    //       ...moviment.Employee,
    //       birthdate: formatISO(new Date(moviment.Employee.birthdate)) as string,
    //     },
    //   };
    // });
    const scripts = await this.createScript(fixedMoviments);

    return scripts;
  }

  async createScriptByMovimentStatus(status: string) {
    const moviments = await this.prismaService.moviment.findMany({
      where: { status: status },
      include: {
        Employee: true,
        Department: true,
        Relationship: true,
      },
    });

    const fixedMoviments = moviments.map((moviment) =>
      fixDateType(moviment),
    ) as CreateMovimentFullDto[];

    const scripts = await this.createScript(fixedMoviments);

    return scripts;
  }

  async createScript(moviments: CreateMovimentFullDto[]) {
    try {
      const setting = await this.settingService.getAllSetting();

      /**
       * Remove todos os scripts pendentes da movimentação.  */
      if (setting.scriptRemovePendingBeforeCreate) {
        const movimentIds = moviments.map((moviment) => moviment.id);
        await this.removeAllPendingScriptsByMovimentId(movimentIds);
      }
      const promises = moviments.map(async (moviment) => {
        /**
         * Busca os templates de scripts relacionados à movimentação.
         * Filtra por moviment.relationshipId e moviment.movimentType. * */
        if (moviment.relationshipId && moviment.movimentType) {
          const templates =
            await this.templateService.findAllByRelationshipAndMovimentType(
              moviment.relationshipId,
              moviment.movimentType,
            );

          /**
           * Gera os scripts de acordo com os templates encontrados.
           *
           * O campo template.scriptType pode ser:
           *    1. powershell_script: Gera um script powershell para ser executado no servidor LDAP.
           *    2. Requisição de API: Faz uma requisição a uma API.
           *    3. send-email: Envia um e-mail.
           *    4. Webscraping: Faz um scraping em uma página web.
           */
          if (templates) {
            let nextScriptNumber = 1;

            debugLog('nextScriptNumber: ', nextScriptNumber);

            /**
             * Alterar o statu da movimentação para 'Scripts gerados':  */
            await this.movimentService.updateStatus(
              moviment.id,
              'Scripts gerados',
            );

            return templates.flat().map((template) => ({
              movimentId: moviment.id,
              templateId: template.id,
              number: `${moviment.number}.${(nextScriptNumber++).toString().padStart(3, '0')}`,
              status: 'Pendente', // 'Pendente', 'Concluído', 'error', 'Cancelado'
              scriptType: template.scriptType, // powershell-scrip | Requisição de API | send-email | Webscraping
              statusDate: new Date(),
              scriptContent: getScriptContent({
                templateContent: template.scriptContent,
                movimentData: moviment,
              }),
              emailContent: getScriptContent({
                templateContent: template.emailContent,
                movimentData: moviment,
              }),
            }));
          }
        }
      });

      /**
       * Executa todas as promises e retorna os scripts gerados.  */
      const createdScripts = Promise.all(promises)
        .then(async (scripts) =>
          scripts.filter((script) => script !== undefined),
        )
        .then(async (scripts) => {
          return await this.prismaService.script.createManyAndReturn({
            data: scripts.flat(),
            skipDuplicates: true,
          });
        });

      if (!createdScripts) {
        return null;
      }

      const scriptList = (await createdScripts)
        .map((script) => script.number)
        .join(', ');

      const fixedScripts = (await createdScripts).map((script) => {
        return {
          ...script,
          statusDate: formatISO(new Date(script.statusDate)),
          createdAt: formatISO(new Date(script.createdAt)),
        };
      });

      this.saveLdapScriptsToFile(fixedScripts);

      fixedScripts.map(async (script) => {
        if (
          // executa o script de requisição de API
          script.scriptType === 'Requisição de API' &&
          setting.scriptExecuteRequestAfterCreate
        ) {
        } else if (
          // executa o script de Webscraping
          script.scriptType === 'Webscraping' &&
          setting.scriptExecuteWebscrapingAfterCreate
        ) {
        } else if (
          // executa o script de envio de e-mail
          script.scriptType === 'E-mail para Terceiros' &&
          setting.scriptExecuteCreateEmailAfterCreate
        ) {
          await this.emailService.createMailToThirdByMoviment([
            script.movimentId,
          ]);
        }
      });

      await this.sysLogService.createSysLog({
        action: 'API-Geração de Scripts',
        message: `Scripts gerados: ${scriptList}`,
        file: 'script.service.ts',
      });

      // Retorna os scripts criados
      debugLog('createdScripts: ', createdScripts);
      return createdScripts;

      // Registra log de erro:
    } catch (error) {
      debugLog('error: ', error);
      await this.sysLogService.createSysLog({
        action: 'API-Geração de Scripts',
        message: `Error: ${error.message}`,
        file: 'script.service.ts',
      });
    }
  }

  /**
   * Executa os scripts dos tipos "Requisição de API", "E-mail para Terceiros" e Webscraping com status "Pendente".
   */
  async executeScriptByPendingStatus() {
    const scripts = await this.findAll('status', 'Pendente');

    scripts.map(async (script) => {
      debugLog('scripts: ', script);

      if (script.scriptType === 'Requisição de API') {
        // executa o script de requisição de API
      } else if (script.scriptType === 'Webscraping') {
        // executa o script de Webscraping
      } else if (script.scriptType === 'E-mail para Terceiros') {
        // await this.emailService.sendMailToThirdByPendingScriptStatus();
      }
    });
  }

  async executeScriptByStatus() {}

  /**
   * Verifica se os scripts foram executados com sucesso e envia e-mail para o servidor.
   */
  async verifyScript() {
    // const scripts = await this.script.verifyScript();
    // return scripts;
    // const emailHtml = render(EmployeeMail());
    // this.emailService.sendMail(
    //   'marcelo.a.mac@gmail.com',
    //   'Email de teste',
    //   'Email de teste',
    //   emailHtml,
    // );
  }

  /**
   * Grava os scripts do tipo 'powershell_script' em arquivos .ps1.
   */
  saveLdapScriptsToFile(scripts: CreateScriptDto[]) {
    const destinyScriptsLdapPath = process.env.DESTINY_SCRIPTS_LDAP_PATH;

    // cria a pasta se não existir
    if (!fs.existsSync(destinyScriptsLdapPath)) {
      fs.mkdirSync(destinyScriptsLdapPath);
    }

    scripts.forEach((script) => {
      if (script.scriptType === 'Powershell') {
        const bom = '\uFEFF'; // BOM (Byte Order Mark) para UTF-8
        const content = bom + script.scriptContent;
        const fileName = `${script.number}.ps1`;
        const filePath = `${destinyScriptsLdapPath}${fileName}`;

        fs.writeFileSync(filePath, content, 'utf8');
      }
    });
  }

  searchExecutedLdapScript() {
    /**
     * procura na pasta env.EXECUTED_SCRIPTS_LDAP_PATH por scripts executados e altera o
     * status do registro na tabela Script para 'executed'. Caso encontre 'ERRO' no nome do arquivo,
     * altera o status para 'error'.
     *
     * str.substring():
     * - start: required
     * - end: optional, if omitted: the rest of the string.
     *
     * Ex: '24001.001-ERROR-Write-Warning $_.Exception.Message'
     */

    const executedScriptsPath = process.env.EXECUTED_SCRIPTS_LDAP_PATH;
    const files = fs.readdirSync(executedScriptsPath);
    let status = '';
    let annotation = '';
    let statusDate = '';

    files.forEach(async (file) => {
      const scriptNumber = file.split('.')[0];

      statusDate = parse(
        file.substring(0, 15),
        'dd/MM/yyyy-HHmmss',
        new Date(),
      ).toISOString();

      // Ex: 'yyyyMMdd-HHmmss-24001.001-ERROR-Write-Warning $_.Exception.Message'
      if (file.includes('ERROR')) {
        status = 'error';
        annotation = file.substring(29);
      } else {
        status = 'Concluído';
        annotation = '';
      }
      // const status = file.includes('ERROR') ? file.substring(29) : 'Concluído';
      await this.prismaService.script.update({
        where: { number: scriptNumber },
        data: { status, annotation, statusDate },
      });
    });
  }
}
