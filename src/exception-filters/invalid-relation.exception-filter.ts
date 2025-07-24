import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { InvalidRelationError } from 'src/errors/invalid-relation.error';
import { Response } from 'express';

/**
 * fonte: https://youtu.be/74Rks96yaAY?t=6784
 */
@Catch(InvalidRelationError)
export class InvalidRelationExceptionFilter extends BaseExceptionFilter {
  catch(exception: InvalidRelationError, host: ArgumentsHost) {
    // pega o contexto do host:
    const ctx = host.switchToHttp();
    // pega a resposta e a requisição:
    const response = ctx.getResponse<Response>();

    return response.status(422).json({
      statusCode: 422,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
