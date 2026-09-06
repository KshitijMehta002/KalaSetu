import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getCategories,
  getFeaturedArtisans
} from '../controllers/productController.js';

const router = express.Router();

router.get('/categories', getCategories);
router.get('/featured-artisans', getFeaturedArtisans);
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

export default router;
