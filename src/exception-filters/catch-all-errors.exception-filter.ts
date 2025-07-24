import { Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class CatchAllErrorsExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: import('@nestjs/common').ArgumentsHost) {
    // salvar logs em arquivo
    // enviar email para o time de desenvolvimento
    // etc.
    return super.catch(exception, host);
  }
}
