import { Module } from '@nestjs/common';
import { EmpleadoService } from './empleado.service.js';
import { EmpleadoController } from './empleado.controller.js';
import { PoolModule } from '../../db/pool.module.js';
import { PersonaModule } from '../persona.module.js';
import { AuthModule } from '../../auth/auth.module.js';

@Module({
	imports: [PoolModule, PersonaModule, AuthModule],
	controllers: [EmpleadoController],
	providers: [EmpleadoService],
})
export class EmpleadoModule {}
