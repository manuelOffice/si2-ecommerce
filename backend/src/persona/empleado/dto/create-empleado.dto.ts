import { CreatePersonaDto } from '../../dto/create-persona.dto.js';

export enum EmpleadoRole {
	ADMIN = 'admin',
	CAJERO = 'cajero',
	VIEWER = 'viewer',
}

export class CreateEmpleadoDto extends CreatePersonaDto {}
