import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

// Vercel Neon integration provides DATABASE_URL
const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || '');
export const db = drizzle(sql, { schema });
