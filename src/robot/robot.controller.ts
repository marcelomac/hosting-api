import { Controller, Get, Query } from '@nestjs/common';
import { RobotService } from './robot.service';

@Controller('robot')
export class RobotController {
  constructor(private readonly robotService: RobotService) {}

  /**
   * Rotina de atualização geral:
   * 1. Busca as portarias no site do DOM no período informado e gera movimentos para cada portaria encontrada.
   * 2. Cria scripts para movimentos com status "Revisado".
   * 3. Executa os scripts dos tipos "Requisição de API", "send-email" e Webscraping com status "Pendente".
   * 4. Verifica se os scripts foram executados com sucesso e envia e-mail para o servidor.
   */
  @Get('all-services')
  async callServices() {
    await this.robotService.callServices();
  }

  /**
   * Busca as portarias no site do Diário Oficial dos Municípios no período informado e
   * gera movimentos para cada portaria encontrada.
   */
  @Get('fetch-ordinance')
  async callFetchOrdinance(
    @Query('dataInicial') dataInicial: string,
    @Query('dataFinal') dataFinal: string,
    @Query('number') number: string,
    @Query('searchType') searchType: string,
  ) {
    const response = await this.robotService.callFetchOrdinance(
      dataInicial,
      dataFinal,
      number,
      searchType,
    );
    return response;
  }

  /**
   * Cria scripts para movimentos com status "Revisado".
   */
  @Get('create-script')
  async callCreateScript() {
    await this.robotService.callCreateScript();
  }

  /**
   * Executa os scripts dos tipos "Requisição de API", "send-email" e Webscraping com status "Pendente".
   */
  @Get('execute-script')
  async callExecuteScript() {
    await this.robotService.callExecuteScript();
  }

  /**
   * Verifica se os scripts foram executados com sucesso e envia e-mail para o servidor.
   */
  @Get('verify-script')
  async callVerifyScript() {
    this.robotService.callVerifyScript();
  }
}
