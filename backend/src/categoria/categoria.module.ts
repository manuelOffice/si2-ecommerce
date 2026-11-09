import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service.js';
import { CategoriaController } from './categoria.controller.js';
import { PoolModule } from '../db/pool.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
	imports: [PoolModule, AuthModule],
	controllers: [CategoriaController],
	providers: [CategoriaService],
})
export class CategoriaModule {}
