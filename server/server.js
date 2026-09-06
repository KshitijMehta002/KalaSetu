import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import appConfig from './config/app.config.js';
import Product from './models/Product.js';
import { seedAll } from './seeds/seedData.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import artisanRoutes from './routes/artisanRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import errorHandler from './middleware/error.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to database
await connectDB();

// Auto-seed if database is freshly started / empty
try {
  const count = await Product.countDocuments();
  if (count === 0) {
    console.log('[Startup] Database is empty. Seeding initial handicraft demo data...');
    await seedAll();
  }
} catch (e) {
  console.warn('[Startup] Auto-seed check notice:', e.message);
}

// Core Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Application branding / config API
app.get('/api/config', (req, res) => {
  res.json({
    success: true,
    config: appConfig
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: appConfig.appName,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/artisan', artisanRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Centralized error handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`[${appConfig.appName} Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

export default app;
