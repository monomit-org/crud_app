import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

console.log('=== PRISMA DIAGNOSTIC ===\n')

// Check Prisma version
try {
  const version = execSync('npx prisma --version', { encoding: 'utf8' })
  console.log('✅ Prisma version:', version.split('\n')[0])
} catch (e) {
  console.log('❌ Failed to get Prisma version')
}

// Check if .env exists
if (fs.existsSync('.env')) {
  console.log('✅ .env file exists')
  const envContent = fs.readFileSync('.env', 'utf8')
  const dbUrl = envContent.match(/DATABASE_URL="?(.+)"?/)?.[1]
  if (dbUrl) {
    console.log('✅ DATABASE_URL found:', dbUrl)
  } else {
    console.log('❌ DATABASE_URL not found in .env')
  }
} else {
  console.log('❌ .env file missing')
}

// Check if Prisma Client exists
const clientPath = './node_modules/.prisma/client'
if (fs.existsSync(clientPath)) {
  console.log('✅ Prisma Client exists at:', clientPath)
  const files = fs.readdirSync(clientPath)
  console.log('   Files:', files.slice(0, 5).join(', '))
} else {
  console.log('❌ Prisma Client not found at:', clientPath)
}

// Check schema.prisma
const schemaPath = './prisma/schema.prisma'
if (fs.existsSync(schemaPath)) {
  console.log('✅ schema.prisma exists')
  const schema = fs.readFileSync(schemaPath, 'utf8')
  const hasUrl = schema.includes('url = env(')
  console.log(`   URL line present: ${hasUrl ? 'Yes' : 'No'}`)
} else {
  console.log('❌ schema.prisma not found')
}

// Check package.json
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  console.log('\n=== Dependencies ===')
  console.log('prisma:', pkg.devDependencies?.prisma || pkg.dependencies?.prisma || 'Not found')
  console.log('@prisma/client:', pkg.dependencies?.['@prisma/client'] || 'Not found')
}

console.log('\n=== Run these commands ===')
console.log('1. npx prisma generate')
console.log('2. npx prisma migrate dev --name init')
console.log('3. node test-db.js')