import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto.js';
import { UpdateVentaDto } from './dto/update-venta.dto.js';
import { PG_POOL } from '../db/pool.provider.js';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class VentaService {
	constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

	async create(createVentaDto: CreateVentaDto, client: PoolClient) {
		const res = await this.pool.query(
			`
			INSERT INTO venta (cliente_id)
			VALUES ($1)`,
			[createVentaDto.cliente_id],
		);
		if (res.rowCount === 0) {
			throw new ConflictException('Vencta could not be created');
		}
		return res.rows[0].id;
	}

	async findAll() {
		const res = await this.pool.query('SELECT * FROM venta');
		return res.rows;
	}

	async findOne(id: number) {
		const res = await this.pool.query(
			`SELECT * FROM venta WEHRE numero = $1`,
			[id],
		);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Venta #${id} not found`);
		}
		return res.rows[0];
	}

	async update(id: number, updateVentaDto: UpdateVentaDto) {
		const res = await this.pool.query(
			`
			UPDATE venta
			SET
				cliente_id = $1,
				monto = $2,
			WHERE numero = $3`,
			[updateVentaDto.cliente_id, updateVentaDto.monto, id],
		);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Venta #${id} not found`);
		}
		return { message: `Venta #${id} updated successfully` };
	}

	async remove(id: number) {
		const res = await this.pool.query('DELETE FROM venta WHERE id = $1', [
			id,
		]);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Venta #${id} not found`);
		}
		return { message: `Venta #${id} removed successfully` };
	}
}
