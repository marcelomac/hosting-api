import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.SECRET_KEY_JWT,
    });
  }

  /**
   *
   * Para a estratégia jwt, o Passport primeiro verifica a assinatura do JWT e decodifica o JSON.
   * Em seguida, ele invoca o método validate() passando o JSON decodificado como seu único parâmetro.
   * Com base na forma como a assinatura JWT funciona, temos a garantia de que estamos recebendo um
   * token válido que assinamos e emitimos anteriormente para um usuário válido.
   *
   * Como resultado de tudo isso, o retorno de chamada do validate() é trivial: simplesmente retornamos
   * um objeto contendo as propriedades userId e username. Lembre-se novamente de que o Passport
   * construirá um objeto user com base no valor de retorno do método validate() e o anexará como uma
   * propriedade ao objeto Request.
   *
   * fonte: https://docs.nestjs.com/recipes/passport
   */

  async validate(payload: any) {
    return payload;
  }
}
