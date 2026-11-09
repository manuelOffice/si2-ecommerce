import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller.js';
import { PaymentService } from './payment.service.js';
import { PoolModule } from '../db/pool.module.js';
import { VentaModule } from '../venta/venta.module.js';

@Module({
	imports: [PoolModule, VentaModule],
	controllers: [PaymentController],
	providers: [PaymentService],
})
export class PaymentModule {}
