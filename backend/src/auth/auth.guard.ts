import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	UnauthorizedException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EmpleadoRole } from '../persona/empleado/dto/create-empleado.dto.js';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: EmpleadoRole[]) =>
	SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<EmpleadoRole[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);
		if (!requiredRoles || requiredRoles.length === 0) {
			return true;
		}
		const request = context.switchToHttp().getRequest<any>();
		const user = request.user;
		if (!user || !user.role) {
			throw new ForbiddenException('User not authenticated');
		}
		if (!requiredRoles.includes(user.role)) {
			throw new UnauthorizedException('Insufficient permissions');
		}
		return true;
	}
}
