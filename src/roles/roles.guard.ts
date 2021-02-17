import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const { user } = context.switchToHttp().getRequest();
    const isAuthorized = this.matchRoles(roles, user.role)
    if (!isAuthorized) throw new UnauthorizedException();
    return true;
  }

  matchRoles(roles : string[], userRole: string): boolean{
    if (!roles || !userRole) return false;
    return roles.includes(userRole)
  }
}
