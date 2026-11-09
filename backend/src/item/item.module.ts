import { Module } from '@nestjs/common';
import { ItemService } from './item.service.js';
import { ItemController } from './item.controller.js';
import { PoolModule } from '../db/pool.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
	imports: [PoolModule, AuthModule],
	controllers: [ItemController],
	providers: [ItemService],
})
export class ItemModule {}
