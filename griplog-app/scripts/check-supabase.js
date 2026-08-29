const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const projectRoot = path.resolve(__dirname, '..');
const envPath = path.join(projectRoot, '.env');

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};

  const entries = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    entries[key] = value.replace(/^['"]|['"]$/g, '');
  }

  return entries;
}

const env = { ...process.env, ...loadEnv(envPath) };
const url = env.EXPO_PUBLIC_SUPABASE_URL;
const key = env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const tables = ['profiles', 'workout_templates', 'workout_sessions', 'exercises', 'sets'];
const supabase = createClient(url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function main() {
  console.log('Checking Supabase connection...');
  console.log('URL:', url);

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);

    if (error) {
      if (error.message.includes('Could not find the table')) {
        console.log(`❌ ${table}: missing table — run the SQL in supabase/schema.sql`);
      } else if (/permission denied|row-level security|JWT|not authenticated/i.test(error.message)) {
        console.log(`⚠️ ${table}: table exists but RLS/auth is blocking access — expected after schema creation`);
      } else {
        console.log(`⚠️ ${table}: ${error.message}`);
      }
    } else {
      console.log(`✅ ${table}: ${data?.length ?? 0} row(s) accessible`);
    }
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
