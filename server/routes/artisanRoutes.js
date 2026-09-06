import express from 'express';
import {
  getArtisanDashboard,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  togglePublish
} from '../controllers/artisanController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = express.Router();

// Enforce authentication & artisan/admin role on all artisan routes
router.use(protect);
router.use(authorize('artisan', 'admin'));

router.get('/dashboard', getArtisanDashboard);
router.get('/products', getMyProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/:id/publish', togglePublish);

export default router;
