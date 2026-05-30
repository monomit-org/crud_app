import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with Prisma v6...')

  // Delete existing data
  const deletedUsers = await prisma.user.deleteMany()
  console.log(`🗑️  Deleted ${deletedUsers.count} existing users`)

  // Create sample users
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'john.doe@example.com',
        name: 'John Doe',
        age: 28,
      },
      {
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        age: 32,
      },
      {
        email: 'bob.wilson@example.com',
        name: 'Bob Wilson',
        age: 25,
      },
      {
        email: 'alice.johnson@example.com',
        name: 'Alice Johnson',
        age: 29,
      },
    ], // Prisma v6 feature to skip duplicate emails
  })

  console.log(`✅ Created ${users.count} users`)
  
  // Verify the data
  const allUsers = await prisma.user.findMany()
  console.log(`📊 Total users in database: ${allUsers.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })