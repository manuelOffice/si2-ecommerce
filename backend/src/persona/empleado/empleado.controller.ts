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
import { EmpleadoService } from './empleado.service.js';
import { EmpleadoRole, CreateEmpleadoDto } from './dto/create-empleado.dto.js';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto.js';
import { Roles, RolesGuard } from '../../auth/auth.guard.js';

@Controller('empleado')
@UseGuards(RolesGuard)
@Roles(EmpleadoRole.ADMIN)
export class EmpleadoController {
	constructor(private readonly empleadoService: EmpleadoService) {}

	@Post()
	create(@Body() createEmpleadoDto: CreateEmpleadoDto) {
		return this.empleadoService.create(createEmpleadoDto);
	}

	@Get()
	findAll(@Query('lastid', ParseIntPipe)lastId: number, @Query('limit', ParseIntPipe)limit: number) {
		return this.empleadoService.findAll(lastId, limit);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.empleadoService.findOneById(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateEmpleadoDto: UpdateEmpleadoDto,
	) {
		return this.empleadoService.update(id, updateEmpleadoDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.empleadoService.remove(id);
	}
}
