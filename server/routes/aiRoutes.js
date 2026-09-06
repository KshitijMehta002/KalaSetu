import express from 'express';
import { enhanceImage, generateCatalog, transcribeAudio } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = express.Router();

// Protected to artisans and admin
router.use(protect);
router.use(authorize('artisan', 'admin'));

router.post('/enhance-image', enhanceImage);
router.post('/generate-catalog', generateCatalog);
router.post('/transcribe', transcribeAudio);

export default router;
