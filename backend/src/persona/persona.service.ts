import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto.js';
import { UpdatePersonaDto } from './dto/update-persona.dto.js';
import { PG_POOL } from '../db/pool.provider.js';
import { Pool, PoolClient } from 'pg';
import { AuthService } from '../auth/auth.service.js';

@Injectable()
export class PersonaService {
	constructor(
		@Inject(PG_POOL) private readonly pool: Pool,
		@Inject(AuthService) private readonly authService: AuthService,
	) {}

	async create(
		createPersonaDto: CreatePersonaDto,
		client: PoolClient,
	): Promise<number> {
		const encrypted = await this.authService.encrypt(
			createPersonaDto.password,
		);
		const res = await client.query(
			`
			INSERT INTO persona (email, password, nombre, telefono)
			VALUES ($1, $2, $3, $4)
			RETURNING id`,
			[createPersonaDto.email, encrypted, createPersonaDto.nombre, createPersonaDto.telefono],
		);
		if (res.rowCount === 0) {
			throw new ConflictException('Persona could not be created');
		}
		return res.rows[0].id;
	}

	async findAll() {
		const res = await this.pool.query('SELECT * FROM persona');
		return res.rows;
	}

	async findOne(id: number) {
		const res = await this.pool.query(
			`SELECT * FROM persona WEHRE id = $1`,
			[id],
		);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Persona #${id} not found`);
		}
		return res.rows[0];
	}

	async update(
		id: number,
		updatePersonaDto: UpdatePersonaDto,
		client: PoolClient,
	) {
		const encrypted = await this.authService.encrypt(
			updatePersonaDto.password,
		);
		const res = await client.query(
			`
			UPDATE persona
			SET
				email = $1,
				password = $2,
				nombre = $3,
				telefono = $4,
			WHERE id = $5`,
			[
				updatePersonaDto.email,
				encrypted,
				updatePersonaDto.nombre,
				updatePersonaDto.telefono,
				id,
			],
		);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Persona #${id} not found`);
		}
	}

	async remove(id: number, client: PoolClient) {
		const res = await client.query('DELETE FROM persona WHERE id = $1', [
			id,
		]);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Persona #${id} not found`);
		}
	}
}
