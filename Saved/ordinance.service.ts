import { Injectable } from '@nestjs/common';
import { CreateOrdinanceDto } from './dto/create-ordinance.dto';
import { UpdateOrdinanceDto } from './dto/update-ordinance.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { scrapingDOM } from './helpers/scrapingDOM';
import { format, formatISO, parseISO, subDays } from 'date-fns';
import { dateUTC, formatUrlDateDOM } from './helpers/formatUrlDateDOM';
import { formatOrdinanceDate } from './helpers/formatOrdinanceDate';
import { formatOrdinanceNumber } from './helpers/formatOrdinanceNumber';
import { getOrdinanceType } from './helpers/getOrdinanceType';
import { getOrdinanceEmployeeName } from './helpers/getOrdinanceEmployeeName';
import { SysLogService } from 'src/syslog/syslog.service';
import { getOrdinanceDepartmentName } from './helpers/getOrdinanceDepartmentName';
import { debugLog } from 'src/helpers/utils/debugLog';
import { SettingService } from 'src/setting/setting.service';
import { getMovimentSetting } from 'src/moviment/helpers/getMovimentSetting';
import * as dotenv from 'dotenv';
import { EmployeeService } from 'src/employee/employee.service';
import { DepartmentService } from 'src/department/department.service';

dotenv.config();
@Injectable()
export class OrdinanceService {
  private readonly baseUrl = process.env.ORDINANCE_URL_SOURCE;

  constructor(
    private prismaService: PrismaService,
    private settingService: SettingService,
    private sysLogService: SysLogService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
  ) {}

  create(createOrdinanceDto: CreateOrdinanceDto) {
    const fixedOrdinanceDto = {
      ...createOrdinanceDto,
      publication: formatISO(parseISO(createOrdinanceDto.publication)),
    };

    try {
      return this.prismaService.ordinance.create({
        data: fixedOrdinanceDto,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  findAll() {
    const response = this.prismaService.ordinance.findMany({
      include: {
        Employee: true,
        Department: true,
      },
      orderBy: { publication: 'desc' },
    });

    return response;
  }

  findOneById(id: string) {
    const response = this.prismaService.ordinance.findUniqueOrThrow({
      where: { id },
    });

    return response;
  }

  findOneByNumber(number: string) {
    const response = this.prismaService.ordinance.findUniqueOrThrow({
      where: { number },
    });

    return response;
  }

  update(id: string, updateOrdinanceDto: UpdateOrdinanceDto) {
    const fixedOrdinanceDto = {
      ...updateOrdinanceDto,
      publication: formatISO(parseISO(updateOrdinanceDto.publication)),
    };

    return this.prismaService.ordinance.update({
      where: { id },
      data: fixedOrdinanceDto,
    });
  }

  updateStatus(id: string, newStatus: string) {
    return this.prismaService.ordinance.update({
      where: { id },
      data: {
        status: newStatus,
      },
    });
  }

  updateMany(where: object, data: object) {
    return this.prismaService.ordinance.updateMany({ where, data });
  }

  remove(id: string) {
    return this.prismaService.ordinance.delete({
      where: { id },
    });
  }

  removeAll() {
    return this.prismaService.ordinance.deleteMany();
  }

  async getOrdinanceByStatus(status: string): Promise<CreateOrdinanceDto[]> {
    const ordinances = await this.prismaService.ordinance.findMany({
      where: {
        status: status,
      },
      orderBy: {
        number: 'asc',
      },
    });

    const fixedOrdinances = ordinances.map((ordinance) => {
      return {
        ...ordinance,
        publication: formatISO(new Date(ordinance.publication)),
        createdAt: formatISO(new Date(ordinance.createdAt)),
      };
    });

    debugLog('fixedOrdinances: ', fixedOrdinances);
    return fixedOrdinances;
  }
  /**
   * Busca as portarias no site do Diário Oficial dos Municípios no período informado.
   * Exemplo de URL: https://www.diariomunicipal.sc.gov.br/?r=site/portal&codigoEntidade=433&categoria=Portarias&dataInicial=01%2F05%2F2024&dataFinal=22%2F05%2F2024
   */
  async fetchOrdinance(
    dataInicial?: string,
    dataFinal?: string,
    number?: string,
  ) {
    try {
      //const baseUrl = process.env.ORDINANCE_URL_SOURCE;

      let startDate: Date;
      let endDate: Date;

      const setting = await this.settingService.getAllSetting();

      const movimentTypeskeyWords = [];
      if (setting.keywordsToIngress.length > 0)
        movimentTypeskeyWords.push({
          name: 'Nomeação',
          keyWords: JSON.parse(setting.keywordsToIngress),
        });
      if (setting.keywordsToDismissal.length > 0)
        movimentTypeskeyWords.push({
          name: 'Exoneração',
          keyWords: JSON.parse(setting.keywordsToDismissal),
        });
      if (setting.keywordsToStartVacation.length > 0)
        movimentTypeskeyWords.push({
          name: 'Início de férias',
          keyWords: JSON.parse(setting.keywordsToStartVacation),
        });
      if (setting.keywordsToEndVacation.length > 0)
        movimentTypeskeyWords.push({
          name: 'Retorno de férias',
          keyWords: JSON.parse(setting.keywordsToEndVacation),
        });
      if (setting.keywordsToStartLicense.length > 0)
        movimentTypeskeyWords.push({
          name: 'Início de licença',
          keyWords: JSON.parse(setting.keywordsToStartLicense),
        });
      if (setting.keywordsToEndLicense.length > 0)
        movimentTypeskeyWords.push({
          name: 'Retorno de licença',
          keyWords: JSON.parse(setting.keywordsToEndLicense),
        });
      if (setting.keywordsToStartSuspension.length > 0)
        movimentTypeskeyWords.push({
          name: 'Início de suspensão',
          keyWords: JSON.parse(setting.keywordsToStartSuspension),
        });
      if (setting.keywordsToEndSuspension.length > 0)
        movimentTypeskeyWords.push({
          name: 'Retorno de suspensão',
          keyWords: JSON.parse(setting.keywordsToEndSuspension),
        });

      if (dataInicial) {
        startDate = dateUTC(dataInicial);
      }
      if (dataFinal) {
        endDate = dateUTC(dataFinal);
      } else {
        endDate = new Date();
      }

      // year recebe como padrão o ano atual
      let year = new Date().getFullYear();
      // se for informado o número da portaria, o ano é extraído do número
      if (number) {
        year = parseInt(number.split('/')[1]);
        startDate = new Date(year, 0, 1);
        endDate = new Date(year, 11, 31);
      } else {
        if (setting.ordinanceStartDateConfig === 'lastFetch') {
          const lastPublicationDate =
            await this.prismaService.ordinance.findFirst({
              select: {
                publication: true,
              },
              orderBy: {
                publication: 'desc',
              },
            });

          startDate = lastPublicationDate?.publication;
        } else {
          startDate = setting.ordinanceStartDaysBefore
            ? subDays(new Date(), setting.ordinanceStartDaysBefore)
            : subDays(new Date(), 3);
        }
      }

      // Formata as datas para o formato utilizado na URL
      const formattedStartDate = formatUrlDateDOM(startDate);
      const formattedEndDate = formatUrlDateDOM(endDate);

      let query = '';
      if (number) {
        const part1 = number.split('/')[0];
        const year = parseInt(number.split('/')[1]);
        query = `&q=${part1}%2F${year}`;
      }

      console.log('query: ', query);

      debugLog('formattedStartDate', formattedStartDate);
      debugLog('formattedEndDate', formattedEndDate);
      // debugLog('Data Início: ', formattedStartDate);
      // debugLog('Data Final : ', formattedEndDate);

      let ordinancesImport = [];
      let page = 1;
      let url = `${this.baseUrl}${query}&dataInicial=${formattedStartDate}&dataFinal=${formattedEndDate}&AtoASolrDocument_page=${page}`;
      //let url = `${this.baseUrl}&dataInicial=${formattedStartDate}&dataFinal=${formattedEndDate}&AtoASolrDocument_page=${page}`;

      // Remove o caractere de quebra de linha "\"
      // url = url.replace(/\\/g, '');

      debugLog('url: ', url);

      // Faz o scraping da página:
      let result = await scrapingDOM(url);

      debugLog('result: ', result);

      // O site do DOM retorna 10 portarias por página:
      const totalPages = Math.ceil(result.total / 10);

      debugLog('totalPages: ', totalPages);

      const movimentSetting = await getMovimentSetting(setting);

      // Loop para percorrer todas as páginas de portarias encontradas no período
      while (page <= totalPages) {
        if (result && result.portarias.length > 0) {
          ordinancesImport = [...ordinancesImport, result.portarias];
        }

        if (page <= totalPages) {
          url = `${this.baseUrl}&dataInicial=${formattedStartDate}&dataFinal=${formattedEndDate}&AtoASolrDocument_page=${page}`;
          result = await scrapingDOM(url);
          page++;
        }
        debugLog('url: ', url);
      }

      debugLog('ordinancesImport: ', ordinancesImport);

      // Formata os objetos de portarias para posterior gravação no banco de dados
      ordinancesImport = await Promise.all(
        ordinancesImport
          .flat()
          .map(async (item: { texto: string; portaria: string }) => ({
            publication: formatOrdinanceDate(item.texto),
            number: formatOrdinanceNumber(item.portaria), // Exemplo: 173/2024
            ordinanceType: getOrdinanceType(item.texto, movimentTypeskeyWords),
            status: movimentSetting.includes(
              getOrdinanceType(item.texto, movimentTypeskeyWords),
            )
              ? 'Pendente'
              : 'Ignorado',
            employeeName: getOrdinanceEmployeeName(item.texto),
            departmentName: getOrdinanceDepartmentName(item.texto),
            employeeId: await this.employeeService.findByName(
              getOrdinanceEmployeeName(item.texto),
            ),
            departmentId: await this.departmentService.findByName(
              getOrdinanceDepartmentName(item.texto),
            ),
            content: item.texto,
          })),
      );

      ordinancesImport = ordinancesImport.map((item) => {
        return {
          ...item,
          employeeId: item.employeeId ? item.employeeId.id : null,
          departmentId: item.departmentId ? item.departmentId.id : null,
        };
      });

      debugLog('ordinancesImport: ', ordinancesImport);

      // sort ordinancesImport by number
      ordinancesImport.sort((a, b) => {
        return a.number.localeCompare(b.number);
      });

      let createdOrdinances = [];
      // Salvando as portarias no banco de dados
      if (ordinancesImport.length > 0) {
        createdOrdinances =
          await this.prismaService.ordinance.createManyAndReturn({
            data: ordinancesImport.flat(),
            skipDuplicates: true,
          });

        debugLog(
          ordinancesImport.flat().length.toString(),
          'portarias importadas.',
        );
        debugLog(createdOrdinances.length.toString(), 'portarias gravadas.');
      }

      /** Grava o log da execução da rotina */
      this.sysLogService.createSysLog({
        action: 'API-Importação de Portarias',
        message: `Período: ${format(startDate, 'dd/MM/yyyy')} a ${format(endDate, 'dd/MM/yyyy')}. ${ordinancesImport.flat().length} portarias importadas. ${createdOrdinances.length} portarias gravadas.`,
        file: 'ordinance.service.ts',
      });

      return createdOrdinances;
      // return {
      //   fetched: ordinancesImport,
      //   saved: ordinances,
      // };
    } catch (error) {
      this.sysLogService.createSysLog({
        action: 'API-Importação de Portarias',
        message: `Período: ${dataInicial} a ${dataFinal} - Erro: ${error}`,
        file: 'ordinance.service.ts',
      });
    }

    console.log('Importação finalizada');
  }
}
