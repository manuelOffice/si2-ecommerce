import { Module } from '@nestjs/common';
import { DatabaseProvider } from './pool.provider.js';

@Module({
	providers: [DatabaseProvider],
	exports: [DatabaseProvider],
})
export class PoolModule {}
