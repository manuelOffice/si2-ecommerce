import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseIntPipe,
	UseGuards,
	UploadedFiles,
	UseInterceptors,
	Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProductoService } from './producto.service.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';
import { Roles, RolesGuard } from '../auth/auth.guard.js';
import { EmpleadoRole } from '../persona/empleado/dto/create-empleado.dto.js';

@Controller('producto')
@UseGuards(RolesGuard)
export class ProductoController {
	constructor(private readonly productoService: ProductoService) {}

	@Post()
	@Roles(EmpleadoRole.ADMIN)
	create(@Body() createProductoDto: CreateProductoDto) {
		return this.productoService.create(createProductoDto);
	}

	@Get()
	findAll(@Query('lastid', ParseIntPipe)lastId: number, @Query('limit', ParseIntPipe)limit: number) {
		return this.productoService.findAll(lastId, limit);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.productoService.findOne(id);
	}

	@Patch(':id')
	@Roles(EmpleadoRole.ADMIN)
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateProductoDto: UpdateProductoDto,
	) {
		return this.productoService.update(id, updateProductoDto);
	}

	@Delete(':id')
	@Roles(EmpleadoRole.ADMIN)
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.productoService.remove(id);
	}

	@Post(':id/image')
	@Roles(EmpleadoRole.ADMIN)
	@UseInterceptors(
		FilesInterceptor('images', 10, {
			storage: memoryStorage(),
			limits: {
			fileSize: 5 * 1024 * 1024,
			},
		}),
	)
	upload(
		@Param('id', ParseIntPipe) id: number,
		@UploadedFiles() images: Express.Multer.File[]
	) {
		return this.productoService.upload(id, images);
	}

	@Get('image/:filename')
	download(
		@Param('filename') filename: string
	) {
		return this.productoService.dowload(filename);
	}
}
