import { 
  createUserSchema, 
  updateUserSchema, 
  userIdSchema,
  isValidEmail,
  isValidAge 
} from '../src/middleware/validation.js';

console.log('🧪 Testing Zod Validation Schemas\n');

// Test 1: Valid user creation
console.log('Test 1: Valid user creation');
try {
  const validUser = {
    email: 'john.doe@example.com',
    name: 'John Doe',
    age: 30
  };
  const result = createUserSchema.parse(validUser);
  console.log('✅ Valid user passed:', result);
} catch (error) {
  console.error('❌ Valid user failed:', error.errors || error.message);
}

console.log('\n---\n');

// Test 2: Invalid email
console.log('Test 2: Invalid email');
try {
  const invalidEmailUser = {
    email: 'not-an-email',
    name: 'Jane Doe',
    age: 25
  };
  createUserSchema.parse(invalidEmailUser);
  console.log('❌ Should have failed');
} catch (error) {
  // Safely access error messages
  const errorMessage = error.errors?.[0]?.message || error.message;
  console.log('✅ Caught invalid email:', errorMessage);
}

console.log('\n---\n');

// Test 3: Name with numbers (invalid)
console.log('Test 3: Name with numbers (invalid)');
try {
  const invalidNameUser = {
    email: 'test@example.com',
    name: 'John123',
    age: 30
  };
  createUserSchema.parse(invalidNameUser);
  console.log('❌ Should have failed');
} catch (error) {
  const errorMessage = error.errors?.[0]?.message || error.message;
  console.log('✅ Caught invalid name:', errorMessage);
}

console.log('\n---\n');

// Test 4: Age too high (invalid)
console.log('Test 4: Age too high (invalid)');
try {
  const invalidAgeUser = {
    email: 'test@example.com',
    name: 'John Doe',
    age: 200
  };
  createUserSchema.parse(invalidAgeUser);
  console.log('❌ Should have failed');
} catch (error) {
  const errorMessage = error.errors?.[0]?.message || error.message;
  console.log('✅ Caught invalid age:', errorMessage);
}

console.log('\n---\n');

// Test 5: User ID validation
console.log('Test 5: User ID validation');
try {
  const validId = { id: '123' };
  const result = userIdSchema.parse(validId);
  console.log('✅ Valid ID passed:', result);
  
  const invalidId = { id: 'abc' };
  userIdSchema.parse(invalidId);
  console.log('❌ Should have failed for invalid ID');
} catch (error) {
  const errorMessage = error.errors?.[0]?.message || error.message;
  console.log('✅ Caught invalid ID:', errorMessage);
}

console.log('\n---\n');

// Test 6: Helper functions
console.log('Test 6: Helper functions');
console.log(`isValidEmail('test@example.com'): ${isValidEmail('test@example.com')}`);
console.log(`isValidEmail('not-email'): ${isValidEmail('not-email')}`);
console.log(`isValidAge(25): ${isValidAge(25)}`);
console.log(`isValidAge(-5): ${isValidAge(-5)}`);

console.log('\n✅ Validation schema tests completed!');