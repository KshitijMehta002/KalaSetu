import express from 'express';
import {
  createOrder,
  getMyOrders,
  getArtisanOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/artisan-orders', authorize('artisan', 'admin'), getArtisanOrders);
router.patch('/:id/status', authorize('artisan', 'admin'), updateOrderStatus);

export default router;
