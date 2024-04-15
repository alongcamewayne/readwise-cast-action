import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

export const client = createClient({
	url: String(process.env.DATABASE_URL),
	authToken: String(process.env.DATABASE_AUTH_TOKEN),
});

export const db = drizzle(client, { schema });
export const luciaAdapter = new DrizzleSQLiteAdapter(db, schema.sessionTable, schema.userTable);
