import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto.js';
import { UpdateItemDto } from './dto/update-item.dto.js';
import { PG_POOL } from '../db/pool.provider.js';
import { Pool } from 'pg';

@Injectable()
export class ItemService {
	constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

	async create(createItemDto: CreateItemDto) {
		const res = await this.pool.query(
			`
			INSERT INTO item (producto_id, tienda_id)
			VALUES ($1, $2)`,
			[createItemDto.producto_id, createItemDto.tienda_id],
		);
		return { message: `Item created successfully` };
	}

	async findAll(lastId: number, limit: number) {
		const res = await this.pool.query(
			`SELECT * FROM item
			WHERE sku > $1
			ORDER BY sku
			LIMIT $2`,
			[lastId, limit]
		);
		return res.rows;
	}

	async findOne(id: number) {
		const res = await this.pool.query(`SELECT * FROM item WEHRE sku = $1`, [
			id,
		]);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Item #${id} not found`);
		}
		return res.rows[0];
	}

	async update(id: number, updateItemDto: UpdateItemDto) {
		const res = await this.pool.query(
			`
			UPDATE item
			SET
				producto_id = $1,
				tienda_id = $2,
				venta_id = $3,
			WHERE sku = $4`,
			[
				updateItemDto.producto_id,
				updateItemDto.tienda_id,
				updateItemDto.venta_id,
				id,
			],
		);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Item #${id} not found`);
		}
		return { message: `Item #${id} updated successfully` };
	}

	async remove(id: number) {
		const res = await this.pool.query('DELETE FROM item WHERE sku = $1', [
			id,
		]);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Item #${id} not found`);
		}
		return { message: `Item #${id} removed successfully` };
	}
}
