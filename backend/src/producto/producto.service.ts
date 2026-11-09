import { Injectable, Inject, StreamableFile, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';
import { PG_POOL } from '../db/pool.provider.js';
import { Pool } from 'pg';
import { createReadStream, promises as fs } from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class ProductoService {
	private readonly DIRECTORY = 'uploads';

	constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

	async create(createProductoDto: CreateProductoDto) {
		const res = await this.pool.query(
			`
			INSERT INTO producto (
			nombre, precio, talla, color, marca, material, categoria_id
			)
			VALUES ($1, $2, $3, $4, $5, $6, $7)`,
			[
				createProductoDto.nombre,
				createProductoDto.precio,
				createProductoDto.talla,
				createProductoDto.color,
				createProductoDto.marca,
				createProductoDto.material,
				createProductoDto.categoria_id,
			],
		);
		return { message: `Producto created successfully` };
	}

	async findAll(lastId: number, limit: number) {
		const res = await this.pool.query(
			`SELECT * FROM producto
			WHERE codigo > $1
			ORDER BY codigo
			LIMIT $2`,
			[lastId, limit]
		);
		return res.rows;
	}

	async findOne(id: number) {
		const res = await this.pool.query(
			'SELECT * FROM producto WHERE codigo = $1',
			[id],
		);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Producto #${id} not found`);
		}
		return res.rows[0];
	}

	async update(id: number, updateProductoDto: UpdateProductoDto) {
		const res = await this.pool.query(
			`
			UPDATE producto
			SET
				nombre = $1,
				precio = $2,
				talla = $3,
				color = $4,
				marca = $5,
				material = $6,
				categoria_id = $7
			WHERE codigo = $8`,
			[
				updateProductoDto.nombre,
				updateProductoDto.precio,
				updateProductoDto.talla,
				updateProductoDto.color,
				updateProductoDto.marca,
				updateProductoDto.material,
				updateProductoDto.categoria_id,
				id,
			],
		);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Producto #${id} not found`);
		}
		return { message: `Producto updated successfully` };
	}

	async remove(id: number) {
		const res = await this.pool.query(
			'DELETE FROM producto WHERE codigo = $1',
			[id],
		);
		if (res.rowCount === 0) {
			throw new NotFoundException(`Producto #${id} not found`);
		}
		return { message: `Producto #${id} removed successfully` };
	}

	async upload(id: number, images: Express.Multer.File[]): Promise<void>{
		if (images.length === 0) {
			throw new BadRequestException();
		}
		const savedFiles: string[] = [];
		const client = await this.pool.connect();
		try {
			await client.query('BEGIN');
			for (const image of images) {
				const extension = path.extname(image.originalname);
				const filename = `${randomUUID()}${extension}`;
				const filePath = path.join(this.DIRECTORY, filename);
				await fs.writeFile(filePath, image.buffer);
				savedFiles.push(filename);
			}
			await client.query(`
				UPDATE producto
				SET fotos = fotos || $1::TEXT[]
				WHERE codigo = $2`,
				[savedFiles, id]
			);
			await client.query('COMMIT');
		} catch (error){
			await client.query('ROLLBACK');
			savedFiles.map(async(file) => await fs.unlink(file));
			throw error;
		} finally {
			await client.end();
		}
	}

	dowload(filename: string) {
		const file = createReadStream(`${this.DIRECTORY}/${filename}`);
		return new StreamableFile(file, {
			type: "image/webp"
		});
	}
}
