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
import { TiendaService } from './tienda.service.js';
import { CreateTiendaDto } from './dto/create-tienda.dto.js';
import { UpdateTiendaDto } from './dto/update-tienda.dto.js';
import { Roles, RolesGuard } from '../auth/auth.guard.js';
import { EmpleadoRole } from '../persona/empleado/dto/create-empleado.dto.js';

@Controller('tienda')
@UseGuards(RolesGuard)
@Roles(EmpleadoRole.ADMIN)
export class TiendaController {
	constructor(private readonly tiendaService: TiendaService) {}

	@Post()
	create(@Body() createTiendaDto: CreateTiendaDto) {
		return this.tiendaService.create(createTiendaDto);
	}

	@Get()
	findAll(@Query('lastid', ParseIntPipe)lastId: number, @Query('limit', ParseIntPipe)limit: number) {
		return this.tiendaService.findAll(lastId, limit);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.tiendaService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateTiendaDto: UpdateTiendaDto,
	) {
		return this.tiendaService.update(id, updateTiendaDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.tiendaService.remove(id);
	}
}
