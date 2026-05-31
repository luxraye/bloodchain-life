import { PrismaClient, FacilityType, AssetStatus, ComponentType, TTIStatus, Role, DispatchStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seeding...')
    
    // 1. Create System Users
    let donor = await prisma.user.findFirst({ where: { email: 'donor.synthetic@bloodchain.local' } })
    if (!donor) donor = await prisma.user.create({ data: { email: 'donor.synthetic@bloodchain.local', name: 'Synthetic Donor', role: 'PUBLIC', bloodType: 'O+' } })
    
    let tech = await prisma.user.findFirst({ where: { email: 'tech.synthetic@bloodchain.local' } })
    if (!tech) tech = await prisma.user.create({ data: { email: 'tech.synthetic@bloodchain.local', name: 'Lab Tech', role: 'LAB' } })
    
    let courier = await prisma.user.findFirst({ where: { email: 'courier.synthetic@bloodchain.local' } })
    if (!courier) courier = await prisma.user.create({ data: { email: 'courier.synthetic@bloodchain.local', name: 'Nightrider Courier', role: 'TRANSIT' } })
    
    // 2. Create Facilities (Geo-Nodes)
    const facilitiesSpecs = [
      { name: 'NBTS Gaborone', type: 'BLOOD_BANK', latitude: -24.6541, longitude: 25.9201 },
      { name: 'Marina Hospital', type: 'HOSPITAL', latitude: -24.6464, longitude: 25.9142 },
      { name: 'Francistown Hub', type: 'BLOOD_BANK', latitude: -21.1667, longitude: 27.5167 },
      { name: 'Mobile Drive Unit A', type: 'MOBILE_DRIVE', latitude: -24.6622, longitude: 25.9311 }
    ]
    
    const facilities = []
    for (const spec of facilitiesSpecs) {
      let fac = await prisma.facility.findFirst({ where: { name: spec.name } })
      if (!fac) fac = await prisma.facility.create({ data: spec as any })
      facilities.push(fac)
    }
    
    const [nbts, marina, francistown, mobileDrive] = facilities

    // 3. Generate 200+ historical BloodAsset records
    console.log('🩸 Generating historical BloodAsset records...')
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
    
    let reactives = 0;
    
    for (let i = 0; i < 220; i++) {
        // Random date within the last 30 days
        const pastDate = new Date()
        pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 30))
        pastDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))
        
        // Distribution of statuses
        const rand = Math.random()
        let status = 'RELEASED'
        if (rand < 0.2) status = 'USED'
        else if (rand < 0.3) status = 'PROCESSED_SPLIT'
        else if (rand < 0.4) status = 'REACTIVE_DISCARD'
        else if (rand < 0.5) status = 'DISCARDED'
        else if (rand < 0.6) status = 'SAFE' // Just for Tremor compatibility, map to RELEASED
        
        if (status === 'SAFE') status = 'RELEASED';
        
        const asset = await prisma.bloodAsset.create({
            data: {
                donorId: donor.id,
                bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
                status: status as AssetStatus,
                componentType: 'WHOLE_BLOOD',
                currentLocation: Math.random() > 0.5 ? nbts.name : francistown.name,
                latitude: Math.random() > 0.5 ? nbts.latitude : francistown.latitude,
                longitude: Math.random() > 0.5 ? nbts.longitude : francistown.longitude,
                createdAt: pastDate,
                updatedAt: pastDate
            }
        })
        
        if (status === 'REACTIVE_DISCARD') {
            reactives++
            // Create TTIScreening for biohazard verification UI
            await prisma.tTIScreening.create({
                data: {
                    assetId: asset.id,
                    technicianId: tech.id,
                    hiv_1_2: Math.random() < 0.3 ? 'REACTIVE' : 'NEGATIVE',
                    hbsag: Math.random() < 0.3 ? 'REACTIVE' : 'NEGATIVE',
                    hcv: Math.random() < 0.3 ? 'REACTIVE' : 'NEGATIVE',
                    syphilis: Math.random() < 0.3 ? 'REACTIVE' : 'NEGATIVE',
                    createdAt: pastDate,
                    updatedAt: pastDate
                }
            })
        }
    }
    
    console.log(`✅ Generated 220 BloodAssets. Seeded ${reactives} REACTIVE_DISCARD TTI screenings.`)
    
    // 4. Generate Active Logistics
    console.log('🚚 Dispatching active logistics routes...')
    const transitAsset1 = await prisma.bloodAsset.create({
        data: {
            donorId: donor.id, bloodType: 'O-', status: 'IN_TRANSIT', currentLocation: 'In Transit to Marina',
            latitude: -24.6500, longitude: 25.9170
        }
    })
    
    const transitAsset2 = await prisma.bloodAsset.create({
        data: {
            donorId: donor.id, bloodType: 'A+', status: 'IN_TRANSIT', currentLocation: 'In Transit to Francistown',
            latitude: -23.1500, longitude: 26.5000
        }
    })
    
    await prisma.dispatch.create({
        data: {
            courierId: courier.id,
            assetId: transitAsset1.id,
            originFacilityId: nbts.id,
            destFacilityId: marina.id,
            status: 'COMPROMISED_COLD_CHAIN',
            departedAt: new Date()
        }
    })
    
    await prisma.dispatch.create({
        data: {
            courierId: courier.id,
            assetId: transitAsset2.id,
            originFacilityId: nbts.id,
            destFacilityId: francistown.id,
            status: 'IN_TRANSIT',
            departedAt: new Date()
        }
    })
    
    console.log('✅ Logistics seeded successfully.')
    console.log('🚀 Seed data successfully hydrated into staging database.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
