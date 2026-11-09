import {
	MiddlewareConsumer,
	Module,
	NestModule,
	RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { EmpleadoModule } from './persona/empleado/empleado.module.js';
import { ClienteModule } from './persona/cliente/cliente.module.js';
import { CategoriaModule } from './categoria/categoria.module.js';
import { ProductoModule } from './producto/producto.module.js';
import { PoolModule } from './db/pool.module.js';
import { TiendaModule } from './tienda/tienda.module.js';
import { VentaModule } from './venta/venta.module.js';
import { ItemModule } from './item/item.module.js';
import { PersonaModule } from './persona/persona.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AuthMiddleware } from './auth/auth.middleware.js';
import { PaymentModule } from './payment/payment.module.js';

@Module({
	imports: [
		EmpleadoModule,
		ClienteModule,
		ProductoModule,
		PoolModule,
		TiendaModule,
		CategoriaModule,
		VentaModule,
		ItemModule,
		PersonaModule,
		AuthModule,
		PaymentModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.exclude(
				{ path: 'auth/login', method: RequestMethod.POST },
				{ path: 'cliente/signup', method: RequestMethod.POST },
			)
			.forRoutes('*');
	}
}
