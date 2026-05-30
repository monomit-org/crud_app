import express from 'express';
import { 
  validateCreateUser, 
  validateUpdateUser, 
  validateUserId,
  validateUserQuery 
} from '../middleware/validation.js';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/userController.js';

const router = express.Router();

// User statistics route (must be before :id route to avoid conflict)
router.get('/stats/summary', getUserStats);

// CRUD routes
router.get('/', validateUserQuery, getAllUsers);
router.get('/:id', validateUserId, getUserById);
router.post('/', validateCreateUser, createUser);
router.put('/:id', validateUserId, validateUpdateUser, updateUser);
router.delete('/:id', validateUserId, deleteUser);

export default router;