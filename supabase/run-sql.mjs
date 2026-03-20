import pg from 'pg';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = new pg.Client({
  host: 'db.vgijyvhbmtakymecdeut.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'fxi5g#xHu#YAi9!',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    console.log('Connecting to Supabase...');
    await client.connect();
    console.log('Connected!');

    // Run schema
    console.log('\n--- Running schema.sql ---');
    const schema = readFileSync(resolve(__dirname, 'schema.sql'), 'utf8');
    await client.query(schema);
    console.log('Schema created successfully!');

    // Run seed
    console.log('\n--- Running seed.sql ---');
    const seed = readFileSync(resolve(__dirname, 'seed.sql'), 'utf8');
    await client.query(seed);
    console.log('Seed data inserted successfully!');

    // Verify
    const tables = ['clients', 'contracts', 'automations', 'agents', 'calendar_posts', 'pipeline_leads', 'notifications', 'activity_log'];
    console.log('\n--- Verification ---');
    for (const table of tables) {
      const res = await client.query(`SELECT count(*) FROM public.${table}`);
      console.log(`  ${table}: ${res.rows[0].count} rows`);
    }

    console.log('\nDone!');
  } catch (err) {
    console.error('Error:', err.message);
    if (err.message.includes('already exists') || err.message.includes('duplicate key')) {
      console.log('(Some data may already exist - this is OK)');
    }
  } finally {
    await client.end();
  }
}

run();
