import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';

// @desc    Get overall marketplace and AI metrics for admin
// @route   GET /api/admin/stats
// @access  Private (Admin only)
export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalArtisans,
      totalCustomers,
      totalProducts,
      publishedProducts,
      totalOrders,
      orders
    ] = await Promise.all([
      User.countDocuments({ role: 'artisan' }),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments(),
      Product.countDocuments({ isPublished: true }),
      Order.countDocuments(),
      Order.find()
    ]);

    const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // AI Feature usage metrics
    const aiImagesEnhanced = await Product.countDocuments({ enhancedImage: { $ne: '' } });
    const aiCatalogsGenerated = totalProducts;
    const priceRecommendations = await Product.countDocuments({ suggestedPrice: { $gt: 0 } });

    res.json({
      success: true,
      stats: {
        totalArtisans,
        totalCustomers,
        totalProducts,
        publishedProducts,
        totalOrders,
        totalSales,
        aiMetrics: {
          aiImagesEnhanced,
          aiCatalogsGenerated,
          priceRecommendationsGenerated: priceRecommendations
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users (artisans & customers)
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const query = {};
    if (role && role !== 'all') query.role = role;

    const users = await User.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all products across all artisans for moderation
// @route   GET /api/admin/products
// @access  Private (Admin only)
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('artisan', 'name email businessName state')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all marketplace orders
// @route   GET /api/admin/orders
// @access  Private (Admin only)
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email phone')
      .populate('items.artisan', 'name businessName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle product publish / moderation status
// @route   PATCH /api/admin/products/:id/moderation
// @access  Private (Admin only)
export const toggleProductModeration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.isPublished = !product.isPublished;
    product.status = product.isPublished ? 'published' : 'draft';
    await product.save();

    res.json({
      success: true,
      message: `Product ${product.isPublished ? 'approved and published' : 'unlisted by moderator'}.`,
      product
    });
  } catch (err) {
    next(err);
  }
};
