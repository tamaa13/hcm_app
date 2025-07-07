import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { Pool } from 'pg';

export const client = new Pool({
   host: process.env.DATABASE_HOST,
   port: parseInt(process.env.DATABASE_PORT as string),
   user: process.env.DATABASE_USER,
   password: process.env.DATABASE_USER_PASSWORD,
   database: process.env.DATABASE_DB,
});

export const db = drizzle(client, { schema });
