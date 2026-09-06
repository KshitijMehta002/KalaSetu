import express from 'express';
import { predictPrice } from '../controllers/pricingController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = express.Router();

router.use(protect);
router.use(authorize('artisan', 'admin'));

router.post('/predict', predictPrice);

export default router;
