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
} from '@nestjs/common';
import { VentaService } from './venta.service.js';
import { CreateVentaDto } from './dto/create-venta.dto.js';
import { UpdateVentaDto } from './dto/update-venta.dto.js';
import { Roles, RolesGuard } from '../auth/auth.guard.js';
import { EmpleadoRole } from '../persona/empleado/dto/create-empleado.dto.js';

@Controller('venta')
@UseGuards(RolesGuard)
@Roles(EmpleadoRole.ADMIN)
export class VentaController {
	constructor(private readonly ventaService: VentaService) {}

	@Get()
	findAll() {
		return this.ventaService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.ventaService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateVentaDto: UpdateVentaDto,
	) {
		return this.ventaService.update(id, updateVentaDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.ventaService.remove(id);
	}
}
