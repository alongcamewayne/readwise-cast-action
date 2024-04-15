import dotenv from 'dotenv';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from '@/db';

dotenv.config({ path: '.env.local' });

migrate(db, { migrationsFolder: 'src/db/migrations' });
