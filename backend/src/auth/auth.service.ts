import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import type * as jwt from 'jsonwebtoken';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import { PG_POOL } from '../db/pool.provider.js';
import { Pool } from 'pg';

@Injectable()
export class AuthService {
	constructor(
		@Inject(JwtService) private readonly jwtService: JwtService,
		@Inject(PG_POOL) private readonly pool: Pool,
	) {}

	async encrypt(password: string): Promise<string> {
		return bcrypt.hash(password, 12);
	}

	async compare(password: string, encrypted: string): Promise<boolean> {
		return bcrypt.compare(password, encrypted);
	}

	generateToken(id: number, role?: string): string {
		const payload = {
			sub: id,
			role: role ?? 'cliente',
		};
		return this.jwtService.sign(payload, {
			secret: process.env.TOKEN_SECRET_KEY,
			algorithm: process.env.TOKEN_ALGORITHM as jwt.Algorithm,
			expiresIn: process.env
				.TOKEN_EXPIRE_TIME as jwt.SignOptions['expiresIn'],
		});
	}

	verifyToken(token: string) {
		return this.jwtService.verify(token, {
			secret: process.env.TOKEN_SECRET_KEY,
		});
	}

	async login(loginAuthDto: LoginAuthDto) {
		const res = await this.pool.query(
			`
			SELECT p.id, p.email, p.password, p.nombre, e.role
			FROM persona p
			LEFT JOIN empleado e ON e.id = p.id
			WHERE p.email = $1`,
			[loginAuthDto.email],
		);
		if (res.rowCount == 0) {
			throw new UnauthorizedException();
		}
		const isValid = await bcrypt.compare(
			loginAuthDto.password,
			res.rows[0].password,
		);
		if (!isValid) {
			throw new UnauthorizedException();
		}
		return this.generateToken(res.rows[0].id, res.rows[0].role);
	}
}
