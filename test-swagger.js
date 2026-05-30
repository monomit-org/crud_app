import { swaggerSpec } from './src/utils/swagger.js';

console.log('📚 Swagger Documentation Generator\n');

// Check if spec was generated
if (swaggerSpec && swaggerSpec.paths) {
  console.log('✅ Swagger specification generated successfully');
  console.log(`\n📊 API Statistics:`);
  console.log(`- Total endpoints: ${Object.keys(swaggerSpec.paths).length}`);
  console.log(`- Defined schemas: ${Object.keys(swaggerSpec.components?.schemas || {}).length}`);
  
  console.log('\n📋 Available endpoints:');
  Object.keys(swaggerSpec.paths).forEach(path => {
    const methods = Object.keys(swaggerSpec.paths[path]);
    console.log(`   ${methods.join(', ').toUpperCase()} ${path}`);
  });
  
  console.log('\n🌐 Swagger UI available at: http://localhost:3000/api-docs');
  console.log('📄 Swagger JSON available at: http://localhost:3000/api-docs.json');
} else {
  console.error('❌ Failed to generate Swagger specification');
}