import {
	Inject,
	Injectable,
	NestMiddleware,
	UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service.js';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(
		@Inject(AuthService) private readonly authService: AuthService,
	) {}

	use(req: Request, res: Response, next: NextFunction) {
		const authorization = req.headers.authorization; //Authorization: 'token_type token'
		if (
			!authorization ||
			!authorization.startsWith(process.env.TOKEN_TYPE ?? 'Bearer')
		) {
			throw new UnauthorizedException();
		}
		const token = authorization.split(' ')[1];
		try {
			const payload = this.authService.verifyToken(token);
			(req as any).user = payload;
		} catch (error) {
			throw new UnauthorizedException();
		}
		next();
	}
}
