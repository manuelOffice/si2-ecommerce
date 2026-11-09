import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service.js';
import { ClienteController } from './cliente.controller.js';
import { PoolModule } from '../../db/pool.module.js';
import { PersonaModule } from '../persona.module.js';
import { AuthModule } from '../../auth/auth.module.js';

@Module({
	imports: [PoolModule, PersonaModule, AuthModule],
	controllers: [ClienteController],
	providers: [ClienteService],
})
export class ClienteModule {}
