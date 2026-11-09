import { CreatePersonaDto } from '../../dto/create-persona.dto.js';

export enum ClienteStatus {
	ACTIVO = 'activo',
	DESHABILITADO = 'deshabilitado',
	ELIMINADO = 'eliminado',
}

export class CreateClienteDto extends CreatePersonaDto {}
