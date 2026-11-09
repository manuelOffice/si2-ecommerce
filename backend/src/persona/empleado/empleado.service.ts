import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto.js';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto.js';
import { PG_POOL } from '../../db/pool.provider.js';
import { Pool } from 'pg';
import { PersonaService } from '../persona.service.js';

@Injectable()
export class EmpleadoService {
	constructor(
		@Inject(PG_POOL) private readonly pool: Pool,
		@Inject(PersonaService) private readonly personaService: PersonaService,
	) {}

	async create(createEmpleadoDto: CreateEmpleadoDto) {
		const client = await this.pool.connect();
		try {
			await client.query('BEGIN');
			const id = await this.personaService.create(
				createEmpleadoDto,
				client,
			);
			await client.query(`INSERT INTO empleado (id) VALUES ($1)`, [id]);
			await client.query('COMMIT');
		} catch (error) {
			await client.query('ROLLBACK');
			throw error;
		} finally {
			await client.end();
		}
		return { message: `Empleado created successfully` };
	}

	async findAll(lastId: number, limit: number) {
		const res = await this.pool.query(
			`SELECT p.email, p.nombre, p.telefono, e.*
			FROM empleado e
			JOIN persona p ON p.id = e.id
			WHERE e.id > $1
			ORDER BY e.id
			LIMIT $2`,
			[lastId, limit]
		);
		return res.rows;
	}

	async findOneById(id: number) {
		const res = await this.pool.query(
			`
			SELECT p.email, p.nombre, p.telefono, e.*
			FROM empleado e
			JOIN persona p ON p.id = e.id
			WHERE e.id = $1`,
			[id],
		);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Empleado #${id} not found`);
		}
		return res.rows[0];
	}

	async findOneByEmail(email: string) {
		const res = await this.pool.query(
			`
			SELECT p.email, p.password
			FROM persona
			WHERE email = $1`,
			[email],
		);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Empleado ${email} not found`);
		}
		return res.rows[0];
	}

	async update(id: number, updateEmpleadoDto: UpdateEmpleadoDto) {
		const client = await this.pool.connect();
		try {
			await client.query('BEGIN');
			await this.personaService.update(id, updateEmpleadoDto, client);
			var res = await client.query(
				`
				UPDATE empleado
				SET
					tienda_id = $1,
					role = $2
				WHERE id = $3`,
				[updateEmpleadoDto.tienda_id, updateEmpleadoDto.role, id],
			);
			if (res.rowCount === 0) {
				throw new NotFoundException(`Empleado #${id} not found`);
			}
			await client.query('COMMIT');
		} catch (error) {
			await client.query('ROLLBACK');
			throw error;
		} finally {
			await client.end();
		}
		return { message: `Empleado #${id} updated successfully` };
	}

	async remove(id: number) {
		const res = await this.pool.query(
			'DELETE FROM empleado WHERE id = $1',
			[id],
		);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Empleado #${id} not found`);
		}
		return { message: `Empleado #${id} removed successfully` };
	}
}
