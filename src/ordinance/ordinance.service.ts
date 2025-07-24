import { Injectable } from '@nestjs/common';
import { CreateOrdinanceDto } from './dto/create-ordinance.dto';
import { UpdateOrdinanceDto } from './dto/update-ordinance.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { scrapingDOM } from './helpers/scrapingDOM';
import { format, formatISO, parseISO, subDays } from 'date-fns';
import { dateUTC, formatUrlDateDOM } from './helpers/formatUrlDateDOM';
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
import { formatOrdinanceDate } from './helpers/formatOrdinanceDate';

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
    searchType?: string,
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

      if (searchType === 'number') {
        if (number) {
          year = parseInt(number.split('/')[1]);
          startDate = new Date(year, 0, 1);
          endDate = new Date(year, 11, 31);
        } else {
          startDate = new Date(year, 0, 1);
          endDate = new Date(year, 11, 31);
        }
      } else if (
        searchType != 'period' &&
        setting.ordinanceStartDateConfig === 'lastFetch'
      ) {
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
      } else if (
        searchType != 'period' &&
        setting.ordinanceStartDateConfig === 'fixed'
      ) {
        startDate = setting.ordinanceStartDaysBefore
          ? subDays(new Date(), setting.ordinanceStartDaysBefore)
          : subDays(new Date(), 3);
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

      let ordinancesImport = [];
      const page = 1;
      const url = `${this.baseUrl}${query}&dataInicial=${formattedStartDate}&dataFinal=${formattedEndDate}&AtoASolrDocument_page=${page}`;

      debugLog('url: ', url);

      // Faz o scraping da página:
      const result = await scrapingDOM(url);

      const movimentSetting = await getMovimentSetting(setting);

      debugLog('result.total_ordinances: ', result.total_ordinances);

      ordinancesImport = result.ordinances;

      // Formata os objetos de portarias para posterior gravação no banco de dados
      ordinancesImport = ordinancesImport
        .flat()
        .map(
          (item: {
            text: string;
            publication: string;
            ordinance_number: string;
            link: string;
          }) => ({
            publication: formatOrdinanceDate(item.publication),
            number: item.ordinance_number, // Exemplo: 173/2024
            ordinanceType: getOrdinanceType(item.text, movimentTypeskeyWords),
            status: movimentSetting.includes(
              getOrdinanceType(item.text, movimentTypeskeyWords),
            )
              ? 'Pendente'
              : 'Ignorado',
            employeeName: getOrdinanceEmployeeName(item.text),
            departmentName: getOrdinanceDepartmentName(item.text),
            employeeId: null,
            departmentId: null,
            content: item.text,
            link: item.link,
          }),
        );

      // employeeId: this.employeeService.findByName(
      //   getOrdinanceEmployeeName(item.text),
      // ),
      // departmentId: this.departmentService.findByName(
      //   getOrdinanceDepartmentName(item.text),
      // ),

      debugLog('ordinancesImport: ', ordinancesImport);

      // await Promise.all(
      //   ordinancesImport.map(async (ordinance) => {
      //     if (!ordinance.employeeName) {
      //       ordinance.employeeId = null;
      //     } else {
      //       const employee = await this.employeeService.findByName(
      //         ordinance.employeeName,
      //       );
      //       ordinance.employeeId = employee ? employee.id : null;
      //     }

      //     if (!ordinance.departmentName) {
      //       ordinance.departmentName = null;
      //     } else {
      //       const department = await this.departmentService.findByName(
      //         ordinance.departmentName,
      //       );
      //       ordinance.departmentId = department ? department.id : null;
      //     }
      //   }),
      // );

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
