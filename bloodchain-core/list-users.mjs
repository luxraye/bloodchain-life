// List all Supabase Auth users
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    'https://xzhmaqmgyeahmtcmsjqv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6aG1hcW1neWVhaG10Y21zanF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjMwOTI1MiwiZXhwIjoyMDg3ODg1MjUyfQ.SEIFYzMr0sZTU6ZhhZBCTxHfpHdSpWVTqEaEzCC_e4U',
    { auth: { autoRefreshToken: false, persistSession: false } }
)

const { data: { users }, error } = await supabase.auth.admin.listUsers()
if (error) { console.error(error.message); process.exit(1) }

console.log('\nAll Supabase Auth users:\n')
for (const u of users) {
    const role = u.app_metadata?.role ?? '(no role)'
    console.log(`  ${u.email.padEnd(40)} role: ${role}`)
}
