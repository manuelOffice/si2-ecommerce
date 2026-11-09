import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { UpdateCategoriaDto } from './dto/update-categoria.dto.js';
import { PG_POOL } from '../db/pool.provider.js';
import { Pool } from 'pg';

@Injectable()
export class CategoriaService {
	constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

	async create(createCategoriaDto: CreateCategoriaDto) {
		const res = await this.pool.query(
			`
			INSERT INTO categoria (nombre, categoria_id)
			VALUES ($1, $2)`,
			[createCategoriaDto.nombre, createCategoriaDto.categoria_id],
		);
		return { message: `Categoria created successfully` };
	}

	async findAll(lastId: number, limit: number) {
		const res = await this.pool.query(
			`SELECT * FROM categoria
			WHERE codigo > $1
			ORDER BY codigo
			LIMIT $2`,
			[lastId, limit]
		);
		return res.rows;
	}

	async findOne(id: number) {
		const res = await this.pool.query(
			'SELECT * FROM categoria WHERE codigo = $1',
			[id],
		);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Categoria #${id} not found`);
		}
		return res.rows[0];
	}

	async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
		const res = await this.pool.query(
			`
			UPDATE categoria
			SET
				nombre = $1,
				categoria_id = $2
			WHERE codigo = $3`,
			[updateCategoriaDto.nombre, updateCategoriaDto.categoria_id, id],
		);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Categoria #${id} not found`);
		}
		return { message: `Categoria #${id} updated successfully` };
	}

	async remove(id: number) {
		const res = await this.pool.query(
			'DELETE FROM categoria WHERE codigo = $1',
			[id],
		);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Categoria #${id} not found`);
		}
		return { message: `Categoria #${id} removed successfully` };
	}
}
