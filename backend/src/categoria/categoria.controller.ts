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
	Query,
} from '@nestjs/common';
import { CategoriaService } from './categoria.service.js';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { UpdateCategoriaDto } from './dto/update-categoria.dto.js';
import { Roles, RolesGuard } from '../auth/auth.guard.js';
import { EmpleadoRole } from '../persona/empleado/dto/create-empleado.dto.js';

@Controller('categoria')
@UseGuards(RolesGuard)
export class CategoriaController {
	constructor(private readonly categoriaService: CategoriaService) {}

	@Post()
	@Roles(EmpleadoRole.ADMIN)
	create(@Body() createCategoriaDto: CreateCategoriaDto) {
		return this.categoriaService.create(createCategoriaDto);
	}

	@Get()
	findAll(@Query('lastid', ParseIntPipe)lastId: number, @Query('limit', ParseIntPipe)limit: number) {
		return this.categoriaService.findAll(lastId, limit);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.categoriaService.findOne(id);
	}

	@Patch(':id')
	@Roles(EmpleadoRole.ADMIN)
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateCategoriaDto: UpdateCategoriaDto,
	) {
		return this.categoriaService.update(id, updateCategoriaDto);
	}

	@Delete(':id')
	@Roles(EmpleadoRole.ADMIN)
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.categoriaService.remove(id);
	}
}
