import dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config({ path: '.env.local' });

export default {
	schema: ['src/db/schema.ts'],
	out: 'src/db/migrations',
	driver: 'better-sqlite',
	dbCredentials: {
		url: String(process.env.DATABASE_URL),
	},
} satisfies Config;
