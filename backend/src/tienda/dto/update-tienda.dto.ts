import { PartialType } from '@nestjs/mapped-types';
import { CreateTiendaDto } from './create-tienda.dto.js';

export class UpdateTiendaDto extends PartialType(CreateTiendaDto) {}
