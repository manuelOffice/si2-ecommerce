import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto.js';
import { UpdateClienteDto } from './dto/update-cliente.dto.js';
import { PersonaService } from '../persona.service.js';
import { PG_POOL } from '../../db/pool.provider.js';
import { Pool } from 'pg';
import { AuthService } from '../../auth/auth.service.js';

@Injectable()
export class ClienteService {
	constructor(
		@Inject(PG_POOL) private readonly pool: Pool,
		@Inject(AuthService) private readonly authService: AuthService,
		@Inject(PersonaService) private readonly personaService: PersonaService,
	) {}

	async signup(createClienteDto: CreateClienteDto): Promise<string> {
		const client = await this.pool.connect();
		var token: string = '';
		try {
			await client.query('BEGIN');
			const id = await this.personaService.create(
				createClienteDto,
				client,
			);
			await client.query(`INSERT INTO cliente (id) VALUES ($1)`, [id]);
			token = this.authService.generateToken(id);
			await client.query('COMMIT');
		} catch (error) {
			await client.query('ROLLBACK');
			throw error;
		} finally {
			await client.end();
		}
		return token;
	}

	async findAll(lastId: number, limit: number) {
		const res = await this.pool.query(
			`SELECT p.email, p.nombre, p.telefono, c.*
			FROM cliente c
			JOIN persona p ON p.id = c.id
			WHERE c.id > $1
			ORDER BY c.id
			LIMIT $2`,
			[lastId, limit]
		);
		return res.rows;
	}

	async findOneById(id: number) {
		const res = await this.pool.query(
			`
			SELECT p.email, p.nombre, p.telefono, c.*
			FROM cliente c
			JOIN persona p ON p.id = c.id
			WHERE c.id = $1`,
			[id],
		);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Cliente #${id} not found`);
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
			throw new NotFoundException(`Cliente ${email} not found`);
		}
		return res.rows[0];
	}

	async update(id: number, updateClienteDto: UpdateClienteDto) {
		const client = await this.pool.connect();
		try {
			await client.query('BEGIN');
			await this.personaService.update(id, updateClienteDto, client);
			var res = await client.query(
				`
				UPDATE cliente
				SET
					estado = $1,
				WHERE id = $2`,
				[updateClienteDto.estado, id],
			);
			if (res.rowCount === 0) {
				throw new NotFoundException(`Cliente #${id} not found`);
			}
			await client.query('COMMIT');
		} catch (error) {
			await client.query('ROLLBACK');
			throw error;
		} finally {
			await client.end();
		}
		return { message: `Cliente #${id} updated successfully` };
	}

	async remove(id: number) {
		const res = await this.pool.query('DELETE FROM cliente WHERE id = $1', [
			id,
		]);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Cliente #${id} not found`);
		}
		return { message: `Cliente #${id} removed successfully` };
	}
}
