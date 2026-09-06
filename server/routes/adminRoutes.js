import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  getAllProducts,
  getAllOrders,
  toggleProductModeration
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = express.Router();

// Strict Admin authorization guard
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/products', getAllProducts);
router.get('/orders', getAllOrders);
router.patch('/products/:id/moderation', toggleProductModeration);

export default router;
