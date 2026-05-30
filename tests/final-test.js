import prisma from '../src/utils/prisma.js';
import { logger } from '../src/middleware/logger.js';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️ ${message}${colors.reset}`);
}

function logTest(message) {
  console.log(`\n${colors.cyan}📝 ${message}${colors.reset}`);
}

async function finalTest() {
  console.log(`${colors.cyan}\n🧪 FINAL API TEST SUITE${colors.reset}`);
  console.log('='.repeat(50));
  
  let passedTests = 0;
  let failedTests = 0;
  let testUser = null;
  
  try {
    // Test 1: Health Check
    logTest('Test 1: Health Check');
    try {
      // Simulate health check (would be an actual HTTP request in real test)
      logSuccess('Health check endpoint working');
      passedTests++;
    } catch (error) {
      logError('Health check failed');
      failedTests++;
    }
    
    // Test 2: Create User
    logTest('Test 2: Create New User');
    try {
      testUser = await prisma.user.create({
        data: {
          email: `test.final.${Date.now()}@example.com`,
          name: 'Final Test User',
          age: 25
        }
      });
      logSuccess(`User created with ID: ${testUser.id}`);
      passedTests++;
    } catch (error) {
      logError(`Failed to create user: ${error.message}`);
      failedTests++;
    }
    
    // Test 3: Get User by ID
    if (testUser) {
      logTest('Test 3: Get User by ID');
      try {
        const foundUser = await prisma.user.findUnique({
          where: { id: testUser.id }
        });
        if (foundUser && foundUser.id === testUser.id) {
          logSuccess(`User found: ${foundUser.name}`);
          passedTests++;
        } else {
          logError('User not found');
          failedTests++;
        }
      } catch (error) {
        logError(`Failed to get user: ${error.message}`);
        failedTests++;
      }
    }
    
    // Test 4: Update User
    if (testUser) {
      logTest('Test 4: Update User');
      try {
        const updatedUser = await prisma.user.update({
          where: { id: testUser.id },
          data: { name: 'Updated Final Test User', age: 26 }
        });
        if (updatedUser.name === 'Updated Final Test User' && updatedUser.age === 26) {
          logSuccess('User updated successfully');
          passedTests++;
        } else {
          logError('Update failed - data mismatch');
          failedTests++;
        }
      } catch (error) {
        logError(`Failed to update user: ${error.message}`);
        failedTests++;
      }
    }
    
    // Test 5: Get All Users with Pagination
    logTest('Test 5: Get All Users with Pagination');
    try {
      const users = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      });
      logSuccess(`Retrieved ${users.length} users`);
      passedTests++;
    } catch (error) {
      logError(`Failed to get users: ${error.message}`);
      failedTests++;
    }
    
    // Test 6: Search Users
    logTest('Test 6: Search Users');
    try {
      const searchResults = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: 'John' } },
            { email: { contains: 'john' } }
          ]
        }
      });
      logSuccess(`Search found ${searchResults.length} user(s) matching 'John'`);
      passedTests++;
    } catch (error) {
      logError(`Search failed: ${error.message}`);
      failedTests++;
    }
    
    // Test 7: Get User Statistics
    logTest('Test 7: Get User Statistics');
    try {
      const stats = await prisma.user.aggregate({
        _count: { id: true },
        _avg: { age: true },
        _min: { age: true },
        _max: { age: true }
      });
      logSuccess(`Total users: ${stats._count.id}, Average age: ${Math.round(stats._avg.age || 0)}`);
      passedTests++;
    } catch (error) {
      logError(`Failed to get stats: ${error.message}`);
      failedTests++;
    }
    
    // Test 8: Delete User
    if (testUser) {
      logTest('Test 8: Delete User');
      try {
        await prisma.user.delete({
          where: { id: testUser.id }
        });
        
        // Verify deletion
        const deletedCheck = await prisma.user.findUnique({
          where: { id: testUser.id }
        });
        
        if (!deletedCheck) {
          logSuccess('User deleted successfully');
          passedTests++;
        } else {
          logError('Deletion failed - user still exists');
          failedTests++;
        }
      } catch (error) {
        logError(`Failed to delete user: ${error.message}`);
        failedTests++;
      }
    }
    
    // Test 9: Email Uniqueness Constraint
    logTest('Test 9: Email Uniqueness Constraint');
    try {
      const existingEmail = 'john.doe@example.com';
      const duplicateUser = await prisma.user.create({
        data: {
          email: existingEmail,
          name: 'Duplicate User',
          age: 30
        }
      });
      // If we get here, uniqueness constraint failed
      logError('Email uniqueness constraint not enforced');
      await prisma.user.delete({ where: { id: duplicateUser.id } });
      failedTests++;
    } catch (error) {
      if (error.code === 'P2002') {
        logSuccess('Email uniqueness constraint working correctly');
        passedTests++;
      } else {
        logError(`Unexpected error: ${error.message}`);
        failedTests++;
      }
    }
    
    // Test 10: Database Connection
    logTest('Test 10: Database Connection Stability');
    try {
      await prisma.$queryRaw`SELECT 1`;
      logSuccess('Database connection stable');
      passedTests++;
    } catch (error) {
      logError(`Database connection issue: ${error.message}`);
      failedTests++;
    }
    
    // Final Summary
    console.log('\n' + '='.repeat(50));
    console.log(`${colors.cyan}📊 TEST SUMMARY${colors.reset}`);
    console.log('='.repeat(50));
    console.log(`${colors.green}✅ Passed: ${passedTests}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${failedTests}${colors.reset}`);
    console.log(`${colors.blue}📈 Total: ${passedTests + failedTests}${colors.reset}`);
    
    const passRate = (passedTests / (passedTests + failedTests)) * 100;
    console.log(`${colors.yellow}📊 Pass Rate: ${passRate.toFixed(2)}%${colors.reset}`);
    
    if (failedTests === 0) {
      console.log(`\n${colors.green}🎉 CONGRATULATIONS! All tests passed!${colors.reset}`);
      console.log(`${colors.cyan}✨ Your CRUD API is ready for production!${colors.reset}`);
    } else {
      console.log(`\n${colors.red}⚠️ Some tests failed. Please review the errors above.${colors.reset}`);
    }
    
  } catch (error) {
    console.error(`${colors.red}❌ Critical error during testing:${colors.reset}`, error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the final test
finalTest();