import { PartialType } from '@nestjs/mapped-types';
import { UpdatePersonaDto } from '../../dto/update-persona.dto.js';
import { EmpleadoRole } from './create-empleado.dto.js';

export class UpdateEmpleadoDto extends UpdatePersonaDto {
	tienda_id?: number;
	role?: EmpleadoRole;
}
