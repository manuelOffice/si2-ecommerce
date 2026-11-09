import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseIntPipe,
	Query,
} from '@nestjs/common';
import { ClienteService } from './cliente.service.js';
import { CreateClienteDto } from './dto/create-cliente.dto.js';
import { UpdateClienteDto } from './dto/update-cliente.dto.js';

@Controller('cliente')
export class ClienteController {
	constructor(private readonly clienteService: ClienteService) {}

	@Post('signup')
	create(@Body() createClienteDto: CreateClienteDto) {
		return this.clienteService.signup(createClienteDto);
	}

	@Get()
	findAll(@Query('lastid', ParseIntPipe)lastId: number, @Query('limit', ParseIntPipe)limit: number) {
		return this.clienteService.findAll(lastId, limit);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.clienteService.findOneById(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateClienteDto: UpdateClienteDto,
	) {
		return this.clienteService.update(id, updateClienteDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.clienteService.remove(id);
	}
}
