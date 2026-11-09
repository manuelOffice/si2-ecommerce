import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PG_POOL } from '../db/pool.provider.js';
import { Pool } from 'pg';
import { ProductCartVenta } from '../venta/dto/product-cart-venta.dto.js';

const TAX_IVA = 0.13;

@Injectable()
export class PaymentService {
	private stripe: Stripe;

	constructor(@Inject(PG_POOL) private readonly pool: Pool) {
		this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
			apiVersion: '2026-08-26.dahlia',
		});
	}

	async calculateOrderAmount(shoppingCart: ProductCartVenta[]): Promise<number> {
		if (shoppingCart.length === 0 || shoppingCart.some((x) => x.cantidad <= 0)) {
			throw new BadRequestException('Shopping Cart is empty');
		}
		const res = await this.pool.query(`
			SELECT COALESCE(
				ROUND(SUM(p.precio * cart.cantidad) * 100), 0
			)::int AS total
			FROM jsonb_to_recordset($1::jsonb)
				AS cart(codigo int, cantidad int)
			JOIN producto p ON p.codigo = cart.codigo
			`,
			[JSON.stringify(shoppingCart)]);
		if (res.rowCount === 0 || res.rows[0].total === 0) {
			throw new BadRequestException('Shopping Cart is empty');
		}
		return res.rows[0].total;
	}

	async createPaymentIntent(shoppingCart: ProductCartVenta[], currency: string = 'usd') {
		const amount = await this.calculateOrderAmount(shoppingCart);
		const taxes = amount * TAX_IVA;
		const paymentIntent = await this.stripe.paymentIntents.create({
			amount: amount + taxes,
			currency: currency,
			automatic_payment_methods: {
				enabled: true,
			},
		});
		return {
			clientSecret: paymentIntent.client_secret,
		};
	}
}
