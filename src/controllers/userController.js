import prisma from '../utils/prisma.js';
import { logger } from '../middleware/logger.js';
import { ApiError } from '../middleware/errorHandler.js';
import { normalizeEmail, sanitizeString } from '../middleware/validation.js';

/**
 * Get all users with pagination and search
 * @route GET /api/users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    // Use validated query data if available, otherwise fall back to req.query
    const { page = 1, limit = 10, search } = req.validatedQuery || req.query;
    const skip = (page - 1) * limit;
    
    // Build search condition
    let whereCondition = {};
    if (search) {
      whereCondition = {
        OR: [
          { name: { contains: search } },
          { email: { contains: search.toLowerCase() } }
        ]
      };
    }
    
    // Get total count for pagination
    const totalUsers = await prisma.user.count({
      where: whereCondition
    });
    
    // Get paginated users
    const users = await prisma.user.findMany({
      where: whereCondition,
      skip: skip,
      take: parseInt(limit),
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    logger.info(`Retrieved ${users.length} users (page ${page}, limit ${limit})`);
    
    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalItems: totalUsers,
        itemsPerPage: parseInt(limit),
        hasNextPage: page * limit < totalUsers,
        hasPrevPage: page > 1
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error in getAllUsers:', error);
    next(error);
  }
};

/**
 * Get user by ID
 * @route GET /api/users/:id
 */
export const getUserById = async (req, res, next) => {
  try {
    // IMPORTANT: Use req.validatedParams instead of req.params
    // The validation middleware already transformed the ID to a number
    const { id } = req.validatedParams || req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }, // Ensure it's a number
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      throw new ApiError(404, `User with ID ${id} not found`);
    }
    
    logger.info(`Retrieved user with ID: ${id}`);
    
    res.status(200).json({
      success: true,
      data: user,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error(`Error in getUserById for ID ${req.params.id}:`, error);
    next(error);
  }
};

/**
 * Create new user
 * @route POST /api/users
 */
export const createUser = async (req, res, next) => {
  try {
    // Use validated body data if available
    const userData = req.validatedBody || req.body;
    const { email, name, age } = userData;
    
    // Sanitize inputs
    const sanitizedEmail = normalizeEmail(email);
    const sanitizedName = sanitizeString(name);
    const sanitizedAge = age || 18;
    
    // Check if user with same email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    });
    
    if (existingUser) {
      throw new ApiError(409, `User with email ${email} already exists`);
    }
    
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        name: sanitizedName,
        age: sanitizedAge
      },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    logger.info(`Created new user: ${newUser.email} (ID: ${newUser.id})`);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error in createUser:', error);
    next(error);
  }
};

/**
 * Update user
 * @route PUT /api/users/:id
 */
export const updateUser = async (req, res, next) => {
  try {
    // Use validated params and body
    const { id } = req.validatedParams || req.params;
    const updateData_raw = req.validatedBody || req.body;
    const { email, name, age } = updateData_raw;
    
    // Ensure ID is a number
    const userId = parseInt(id);
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!existingUser) {
      throw new ApiError(404, `User with ID ${id} not found`);
    }
    
    // If email is being updated, check if new email is already taken
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: normalizeEmail(email) }
      });
      
      if (emailExists) {
        throw new ApiError(409, `User with email ${email} already exists`);
      }
    }
    
    // Prepare update data
    const updateData = {};
    if (email) updateData.email = normalizeEmail(email);
    if (name) updateData.name = sanitizeString(name);
    if (age !== undefined) updateData.age = age;
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    logger.info(`Updated user with ID: ${id}`);
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error(`Error in updateUser for ID ${req.params.id}:`, error);
    next(error);
  }
};

/**
 * Delete user
 * @route DELETE /api/users/:id
 */
export const deleteUser = async (req, res, next) => {
  try {
    // Use validated params
    const { id } = req.validatedParams || req.params;
    
    // Ensure ID is a number
    const userId = parseInt(id);
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!existingUser) {
      throw new ApiError(404, `User with ID ${id} not found`);
    }
    
    // Delete user
    await prisma.user.delete({
      where: { id: userId }
    });
    
    logger.info(`Deleted user with ID: ${id} (${existingUser.email})`);
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: {
        id: userId,
        email: existingUser.email,
        name: existingUser.name
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error(`Error in deleteUser for ID ${req.params.id}:`, error);
    next(error);
  }
};

/**
 * Get user statistics
 * @route GET /api/users/stats/summary
 */
export const getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count();
    
    const ageStats = await prisma.user.aggregate({
      _avg: {
        age: true
      },
      _min: {
        age: true
      },
      _max: {
        age: true
      }
    });
    
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        averageAge: Math.round(ageStats._avg.age || 0),
        youngestUser: ageStats._min.age || 0,
        oldestUser: ageStats._max.age || 0,
        recentUsers
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error in getUserStats:', error);
    next(error);
  }
};