import { Module } from '@nestjs/common';
import { VentaService } from './venta.service.js';
import { VentaController } from './venta.controller.js';
import { PoolModule } from '../db/pool.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
	imports: [PoolModule, AuthModule],
	controllers: [VentaController],
	providers: [VentaService],
})
export class VentaModule {}
