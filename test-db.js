import prisma from './src/utils/prisma.js'

async function testConnection() {
  try {
    console.log('🔍 Testing Prisma v6 connection...')
    
    // Get Prisma version
    const version = await prisma.$queryRaw`SELECT sqlite_version()`
    console.log(`✅ SQLite version: ${version[0]['sqlite_version()']}`)
    
    // Try to count users
    const userCount = await prisma.user.count()
    console.log(`✅ Database connected! Current user count: ${userCount}`)
    
    // Fetch all users to verify
    const users = await prisma.user.findMany()
    if (users.length > 0) {
      console.log(`📋 Sample user: ${users[0].name} (${users[0].email})`)
    }
    
    // If no users, suggest seeding
    if (userCount === 0) {
      console.log('💡 Database is empty. Run: node prisma/seed.js')
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    console.error('💡 Make sure you have run: npx prisma migrate dev --name init')
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()