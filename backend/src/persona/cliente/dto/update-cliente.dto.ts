import { PartialType } from '@nestjs/mapped-types';
import { UpdatePersonaDto } from '../../dto/update-persona.dto.js';
import { ClienteStatus } from './create-cliente.dto.js';

export class UpdateClienteDto extends UpdatePersonaDto {
	estado?: ClienteStatus;
}
