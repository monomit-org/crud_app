import prisma from './src/utils/prisma.js';

async function testCRUD() {
  console.log('🧪 Testing CRUD Operations\n');
  
  try {
    // 1. CREATE - Create a new user
    console.log('1. CREATE Operation:');
    const newUser = await prisma.user.create({
      data: {
        email: 'crud.test@example.com',
        name: 'CRUD Test User',
        age: 25
      }
    });
    console.log('✅ Created user:', { id: newUser.id, email: newUser.email, name: newUser.name });
    
    // 2. READ - Read the user
    console.log('\n2. READ Operation:');
    const foundUser = await prisma.user.findUnique({
      where: { id: newUser.id }
    });
    console.log('✅ Found user:', foundUser);
    
    // 3. UPDATE - Update the user
    console.log('\n3. UPDATE Operation:');
    const updatedUser = await prisma.user.update({
      where: { id: newUser.id },
      data: { name: 'Updated CRUD User', age: 26 }
    });
    console.log('✅ Updated user:', { name: updatedUser.name, age: updatedUser.age });
    
    // 4. LIST - List all users
    console.log('\n4. LIST Operation:');
    const allUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    console.log(`✅ Found ${allUsers.length} users (last 5):`);
    allUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email})`);
    });
    
    // 5. DELETE - Delete the user
    console.log('\n5. DELETE Operation:');
    await prisma.user.delete({
      where: { id: newUser.id }
    });
    console.log('✅ Deleted user with ID:', newUser.id);
    
    // Verify deletion
    const deletedCheck = await prisma.user.findUnique({
      where: { id: newUser.id }
    });
    console.log('✅ Verified deletion - user not found:', deletedCheck === null);
    
    console.log('\n🎉 All CRUD operations completed successfully!');
    
  } catch (error) {
    console.error('❌ CRUD test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCRUD();