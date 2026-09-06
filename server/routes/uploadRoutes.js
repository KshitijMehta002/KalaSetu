import express from 'express';
import { upload } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = express.Router();

router.post('/', protect, authorize('artisan', 'admin'), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload an image file.'
    });
  }

  // Construct accessible relative URL path
  const imageUrl = `/uploads/${req.file.filename}`;

  res.json({
    success: true,
    message: 'Image uploaded successfully',
    imageUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

export default router;
