import { Controller, Get, Post, Inject, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';

@Controller('auth')
export class AuthController {
	constructor(
		@Inject(AuthService) private readonly authService: AuthService,
	) {}

	@Post('login')
	async login(@Body() loginAuthDto: LoginAuthDto) {
		return this.authService.login(loginAuthDto);
	}
}
