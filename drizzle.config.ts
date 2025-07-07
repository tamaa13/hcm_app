import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
   out: './drizzle',
   schema: './src/db/schema.ts',
   dialect: 'postgresql',
   dbCredentials: {
      url: process.env.DATABASE_URL!,
      database: process.env.DATABASE_DB!,
      host: process.env.DATABASE_HOST!,
      user: process.env.DATABASE_USER!,
      password: process.env.DATABASE_USER_PASSWORD!,
      port: parseInt(process.env.DATABASE_PORT!),
      ssl: false,
   },
});
