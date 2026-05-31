import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://xzhmaqmgyeahmtcmsjqv.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6aG1hcW1neWVhaG10Y21zanF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjMwOTI1MiwiZXhwIjoyMDg3ODg1MjUyfQ.SEIFYzMr0sZTU6ZhhZBCTxHfpHdSpWVTqEaEzCC_e4U'

const ASSIGNMENTS = [
    { email: 'azure@bloodchain.com', role: 'PUBLIC' },
    { email: 'scyther@bloodchain.com', role: 'MEDICAL' },
    { email: 'voyager@bloodchain.com', role: 'TRANSIT' },
    { email: 'mars@bloodchain.com', role: 'LAB' },
    { email: 'admin@bloodchain.com', role: 'ADMIN' },
]

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
})

console.log('🩸 Bloodchain — Role Assignment\n')

const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
if (listError) { console.error('❌ Could not fetch users:', listError.message); process.exit(1) }

for (const { email, role } of ASSIGNMENTS) {
    const user = users.find(u => u.email === email)
    if (!user) { console.log(`  ⚠️  ${email} — not found, skipping`); continue }

    process.stdout.write(`  ${email.padEnd(35)} → ${role}... `)
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
        app_metadata: { ...user.app_metadata, role }
    })
    console.log(error ? `❌ ${error.message}` : '✅')
}

console.log('\nDone. Users must sign out and back in for the new role to take effect.')
