import { Module } from '@nestjs/common';
import { PersonaService } from './persona.service.js';
import { PoolModule } from '../db/pool.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
	imports: [PoolModule, AuthModule],
	controllers: [],
	providers: [PersonaService],
	exports: [PersonaService],
})
export class PersonaModule {}
