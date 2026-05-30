import { PrismaClient } from '@prisma/client'

// Prisma v6 extension for soft delete or logging (optional)
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty',
})

// Handle graceful shutdown for Prisma v6
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

// Handle SIGINT (Ctrl+C) gracefully
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

export default prisma