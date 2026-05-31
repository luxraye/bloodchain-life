import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://xzhmaqmgyeahmtcmsjqv.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6aG1hcW1neWVhaG10Y21zanF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjMwOTI1MiwiZXhwIjoyMDg3ODg1MjUyfQ.SEIFYzMr0sZTU6ZhhZBCTxHfpHdSpWVTqEaEzCC_e4U'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
})

const USERS = [
    { email: 'lab@bloodchain.bw', name: 'Lab Technician', role: 'LAB' },
    { email: 'medical@bloodchain.bw', name: 'Medical Officer', role: 'MEDICAL' },
    { email: 'transit@bloodchain.bw', name: 'Transit Courier', role: 'TRANSIT' },
    { email: 'admin@bloodchain.bw', name: 'System Admin', role: 'ADMIN' },
]

console.log('🩸 Bloodchain Pilot User Seeder\n')

for (const u of USERS) {
    process.stdout.write(`  ${u.email} (${u.role})... `)
    const { data, error } = await supabase.auth.admin.createUser({
        email: u.email,
        password: 'Bloodchain2026!',
        email_confirm: true,
        app_metadata: { role: u.role },
        user_metadata: { name: u.name },
    })
    if (error) {
        const msg = error.message.toLowerCase()
        if (msg.includes('already') || msg.includes('unique')) {
            console.log('⚠️  already exists — skipped')
        } else {
            console.log(`❌ ${error.message}`)
        }
    } else {
        console.log(`✅ id=${data.user.id}`)
    }
}

console.log('\n✅ Seeding complete. Password for all users: Bloodchain2026!')
