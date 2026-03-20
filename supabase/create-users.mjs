import pg from 'pg';

const client = new pg.Client({
  host: 'db.vgijyvhbmtakymecdeut.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'fxi5g#xHu#YAi9!',
  ssl: { rejectUnauthorized: false }
});

async function createUsers() {
  try {
    console.log('Connecting...');
    await client.connect();

    // Check if users already exist
    const existing = await client.query("SELECT email FROM auth.users WHERE email IN ('gabriel@aiox.com.br', 'vitor@aiox.com.br')");
    if (existing.rows.length > 0) {
      console.log('Users already exist:', existing.rows.map(r => r.email).join(', '));
      console.log('Skipping creation.');
      await client.end();
      return;
    }

    // Create Gabriel (admin)
    console.log('Creating gabriel@aiox.com.br (admin)...');
    await client.query(`
      INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'gabriel@aiox.com.br',
        crypt('OmniAdmin2026!', gen_salt('bf')),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Gabriel Oliveira", "role": "admin"}',
        now(), now(), '', '', '', ''
      )
    `);
    console.log('Gabriel created!');

    // Create Vitor (viewer)
    console.log('Creating vitor@aiox.com.br (viewer)...');
    await client.query(`
      INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'vitor@aiox.com.br',
        crypt('OmniViewer2026!', gen_salt('bf')),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Vitor", "role": "viewer"}',
        now(), now(), '', '', '', ''
      )
    `);
    console.log('Vitor created!');

    // Verify profiles were auto-created
    const profiles = await client.query('SELECT id, full_name, role FROM public.profiles');
    console.log('\nProfiles:', profiles.rows);

    console.log('\nUsers created successfully!');
    console.log('Gabriel: gabriel@aiox.com.br / OmniAdmin2026!');
    console.log('Vitor: vitor@aiox.com.br / OmniViewer2026!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

createUsers();
