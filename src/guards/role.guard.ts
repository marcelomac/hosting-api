import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { LevelRoles } from 'src/user/user.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * 'role' é o nome do decorator que criamos em role.decorator.ts
   */

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    /**
     * Primeiro verifica a role do usuário;
     * Depois verifica o nível da role: Administrador: 3, Revisor: 2, Usuário: 1
     */
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userRole = user.role;

    if (!userRole) {
      return false;
    }

    const userRoleLevel = LevelRoles[userRole];

    /**
     * Verifica a role anotada no método (handler) que está sendo chamado;
     */
    const handlerRole = this.reflector.get('role', context.getHandler());

    if (handlerRole) {
      // se existir a role, então pega o seu  nível:
      const handlerRoleLevel = LevelRoles[handlerRole];

      // se o nível da role do usuário for maior ou igual ao nível da role do método, então ele pode acessar
      return userRoleLevel >= handlerRoleLevel;
    }
    // se não tiver a role no método, então verifica se a classe tem uma role anotada:
    else {
      const classRole = this.reflector.get('role', context.getClass());
      if (classRole) {
        // se existir a role na classe, então pega o nível da role:
        const classRoleLevel = LevelRoles[classRole];

        // se o nível da role do usuário for maior ou igual ao nível da role da classe, então ele pode acessar
        return userRoleLevel >= classRoleLevel;
      }

      // se não existir a role no método e nem na classe, então considera o acesso como 'público':
      else {
        return true;
      }
    }
  }
}
