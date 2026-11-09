import { Module } from '@nestjs/common';
import { TiendaService } from './tienda.service.js';
import { TiendaController } from './tienda.controller.js';
import { PoolModule } from '../db/pool.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
	imports: [PoolModule, AuthModule],
	controllers: [TiendaController],
	providers: [TiendaService],
})
export class TiendaModule {}
