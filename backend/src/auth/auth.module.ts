import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from './auth.middleware.js';
import { AuthController } from './auth.controller.js';
import { PoolModule } from '../db/pool.module.js';
import { RolesGuard } from './auth.guard.js';

@Module({
	imports: [PoolModule],
	providers: [JwtService, AuthService, AuthMiddleware, RolesGuard],
	exports: [JwtService, AuthService, AuthMiddleware, RolesGuard],
	controllers: [AuthController],
})
export class AuthModule {}
