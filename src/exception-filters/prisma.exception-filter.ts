import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

/**
 * https://youtu.be/74Rks96yaAY?t=3459
 * https://docs.nestjs.com/exception-filters#exception-filters-1
 * https://www.prisma.io/docs/orm/reference/error-reference
 * https://www.prisma.io/docs/orm/reference/error-reference#error-codes
 */
@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    // pega o contexto do host:
    const ctx = host.switchToHttp();
    // pega a resposta e a requisição:
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';

    switch (exception.code) {
      case 'P2000':
        status = HttpStatus.BAD_REQUEST;
        message = 'Valor muito longo para o tipo de coluna';
        break;
      case 'P2001':
        status = HttpStatus.NOT_FOUND;
        message = 'Registro não encontrado';
        break;
      case 'P2002':
        status = HttpStatus.CONFLICT;
        message = 'Falha na restrição de unicidade';
        break;
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = 'Falha de relacionamento de tabelas.';
        break;
      case 'P2004':
        status = HttpStatus.BAD_REQUEST;
        message = 'Falha na restrição de tabela';
        break;
      case 'P2005':
        status = HttpStatus.BAD_REQUEST;
        message = 'Valor inválido';
        break;
      case 'P2006':
        status = HttpStatus.BAD_REQUEST;
        message = 'Dados inválidos';
        break;
      case 'P2007':
        status = HttpStatus.BAD_REQUEST;
        message = 'Erro de validação de dados';
        break;
      case 'P2008':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Erro de interpretação da consulta';
        break;
      case 'P2009':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Erro de execução da consulta';
        break;
      case 'P2010':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Falha na consulta bruta';
        break;
      case 'P2011':
        status = HttpStatus.BAD_REQUEST;
        message = 'Violação de restrição de nulo';
        break;
      case 'P2012':
        status = HttpStatus.BAD_REQUEST;
        message = 'Valor obrigatório ausente';
        break;
      case 'P2013':
        status = HttpStatus.BAD_REQUEST;
        message = 'Argumento ausente';
        break;
      case 'P2014':
        status = HttpStatus.BAD_REQUEST;
        message = 'Violação de integridade relacional';
        break;
      case 'P2015':
        status = HttpStatus.NOT_FOUND;
        message = 'Registro relacionado não encontrado';
        break;
      case 'P2016':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Erro de interpretação';
        break;
      case 'P2017':
        status = HttpStatus.BAD_REQUEST;
        message = 'Registros não conectados';
        break;
      case 'P2018':
        status = HttpStatus.NOT_FOUND;
        message = 'Registros conectados obrigatórios não encontrados';
        break;
      case 'P2019':
        status = HttpStatus.BAD_REQUEST;
        message = 'Erro de entrada';
        break;
      case 'P2020':
        status = HttpStatus.BAD_REQUEST;
        message = 'Valor fora do intervalo';
        break;
      case 'P2021':
        status = HttpStatus.NOT_FOUND;
        message = 'Tabela não existe';
        break;
      case 'P2022':
        status = HttpStatus.NOT_FOUND;
        message = 'Coluna não existe';
        break;
      case 'P2023':
        status = HttpStatus.BAD_REQUEST;
        message = 'Dados inconsistentes na coluna';
        break;
      case 'P2024':
        status = HttpStatus.REQUEST_TIMEOUT;
        message = 'Tempo esgotado';
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = exception.message;
        break;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: 'Database Error',
    });

    /**
     * P2025
     * "An operation failed because it depends on one or more records that were required but
     * not found. {cause}"
     */
    // if (exception.code === 'P2025') {
    //   return response.status(404).json({
    //     statusCode: 404,
    //     timestamp: new Date().toISOString(),
    //     message: exception.message,
    //   });
    // }

    // return response.status(500).json({
    //   statusCode: 500,
    //   timestamp: new Date().toISOString(),
    //   message: exception.message, // 'Internal server error',
    // });
  }
}
