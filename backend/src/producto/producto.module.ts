import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service.js';
import { ProductoController } from './producto.controller.js';
import { PoolModule } from '../db/pool.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
	imports: [PoolModule, AuthModule],
	controllers: [ProductoController],
	providers: [ProductoService],
})
export class ProductoModule {}
