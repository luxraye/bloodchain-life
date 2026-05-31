// Set passwords for manually-created Supabase users
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://xzhmaqmgyeahmtcmsjqv.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6aG1hcW1neWVhaG10Y21zanF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjMwOTI1MiwiZXhwIjoyMDg3ODg1MjUyfQ.SEIFYzMr0sZTU6ZhhZBCTxHfpHdSpWVTqEaEzCC_e4U'

const PASSWORD = 'Bloodchain2026!'

const USERS = [
    'azure@bloodchain.com',
    'scyther@bloodchain.com',
    'voyager@bloodchain.com',
    'mars@bloodchain.com',
    'admin@bloodchain.com',
]

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
})

console.log('🩸 Setting passwords...\n')

const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
if (listError) { console.error('❌', listError.message); process.exit(1) }

for (const email of USERS) {
    const user = users.find(u => u.email === email)
    if (!user) { console.log(`  ⚠️  ${email} — not found`); continue }

    process.stdout.write(`  ${email.padEnd(35)} ... `)
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
        password: PASSWORD,
        email_confirm: true,
    })
    console.log(error ? `❌ ${error.message}` : `✅`)
}

console.log(`\nAll users can now log in with: ${PASSWORD}`)
