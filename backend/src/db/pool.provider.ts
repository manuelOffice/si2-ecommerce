import { Provider } from '@nestjs/common';
import { Pool } from 'pg';

export const PG_POOL = 'PG_POOL';

export const DatabaseProvider: Provider = {
	provide: PG_POOL,
	inject: [],
	useFactory: () => {
		return new Pool({
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT ?? 5432),
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			max: Number(process.env.DB_POOL_MAX ?? 5),
		});
	},
};
