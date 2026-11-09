import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service.js';
import { ProductCartVenta } from '../venta/dto/product-cart-venta.dto.js';

@Controller('payment')
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@Post()
	async payment_intent(@Body() body: { cart: ProductCartVenta[], currency: string}) {
		return this.paymentService.createPaymentIntent(body.cart, body.currency);
	}
}
