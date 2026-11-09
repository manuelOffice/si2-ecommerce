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
import { ItemService } from './item.service.js';
import { CreateItemDto } from './dto/create-item.dto.js';
import { UpdateItemDto } from './dto/update-item.dto.js';
import { Roles, RolesGuard } from '../auth/auth.guard.js';
import { EmpleadoRole } from '../persona/empleado/dto/create-empleado.dto.js';

@Controller('item')
@UseGuards(RolesGuard)
@Roles(EmpleadoRole.ADMIN)
export class ItemController {
	constructor(private readonly itemService: ItemService) {}

	@Post()
	create(@Body() createItemDto: CreateItemDto) {
		return this.itemService.create(createItemDto);
	}

	@Get()
	findAll(@Query('lastid', ParseIntPipe)lastId: number, @Query('limit', ParseIntPipe)limit: number) {
		return this.itemService.findAll(lastId, limit);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.itemService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateItemDto: UpdateItemDto,
	) {
		return this.itemService.update(id, updateItemDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.itemService.remove(id);
	}
}
