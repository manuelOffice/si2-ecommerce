import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTiendaDto } from './dto/create-tienda.dto.js';
import { UpdateTiendaDto } from './dto/update-tienda.dto.js';
import { PG_POOL } from '../db/pool.provider.js';
import { Pool } from 'pg';

@Injectable()
export class TiendaService {
	constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

	async create(createTiendaDto: CreateTiendaDto) {
		const res = await this.pool.query(
			`
			INSERT INTO tienda (latitud_ubicacion, longitud_ubicacion)
			VALUES ($1, $2)`,
			[
				createTiendaDto.latitud_ubicacion,
				createTiendaDto.longitud_ubicacion,
			],
		);
		return { message: `Tienda created successfully` };
	}

	async findAll(lastId: number, limit: number) {
		const res = await this.pool.query(
			`SELECT * FROM tienda
			WHERE codigo > $1
			ORDER BY codigo
			LIMIT $2`,
			[lastId, limit]
		);
		return res.rows;
	}

	async findOne(id: number) {
		const res = await this.pool.query(
			'SELECT * FROM tienda WHERE codigo = $1',
			[id],
		);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Tienda #${id} not found`);
		}
		return res.rows[0];
	}

	async update(id: number, updateTiendaDto: UpdateTiendaDto) {
		const res = await this.pool.query(
			`
			UPDATE tienda
			SET
				latitud_ubicacion = $1,
				longitud_ubicacion = $2
			WHERE codigo = $3`,
			[
				updateTiendaDto.latitud_ubicacion,
				updateTiendaDto.longitud_ubicacion,
				id,
			],
		);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Tienda #${id} not found`);
		}
		return { message: `Tienda #${id} updated successfully` };
	}

	async remove(id: number) {
		const res = await this.pool.query(
			'DELETE FROM tienda WHERE codigo = $1',
			[id],
		);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Tienda #${id} not found`);
		}
		return { message: `Tienda #${id} removed successfully` };
	}
}
