import fs from 'fs'

const path = './src/middleware/validation.js'
console.log('Checking path:', path)
console.log('File exists:', fs.existsSync(path))

if (fs.existsSync(path)) {
  console.log('File content preview:')
  const content = fs.readFileSync(path, 'utf8')
  console.log(content.substring(0, 200))
}