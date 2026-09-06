import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get artisan dashboard summary stats, recent products and orders
// @route   GET /api/artisan/dashboard
// @access  Private (Artisan only)
export const getArtisanDashboard = async (req, res, next) => {
  try {
    const artisanId = req.user._id;

    const [totalProducts, publishedProducts, draftProducts, recentProducts] = await Promise.all([
      Product.countDocuments({ artisan: artisanId }),
      Product.countDocuments({ artisan: artisanId, isPublished: true }),
      Product.countDocuments({ artisan: artisanId, isPublished: false }),
      Product.find({ artisan: artisanId }).sort({ createdAt: -1 }).limit(5)
    ]);

    // Find orders containing products of this artisan
    const orders = await Order.find({ 'items.artisan': artisanId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate total revenue and order items count for this artisan
    const allArtisanOrders = await Order.find({ 'items.artisan': artisanId });
    let totalSales = 0;
    let totalOrderCount = allArtisanOrders.length;

    allArtisanOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.artisan.toString() === artisanId.toString()) {
          totalSales += item.price * item.quantity;
        }
      });
    });

    res.json({
      success: true,
      stats: {
        totalProducts,
        publishedProducts,
        draftProducts,
        totalOrders: totalOrderCount,
        totalSales
      },
      recentProducts,
      recentOrders: orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all products belonging to the logged-in artisan
// @route   GET /api/artisan/products
// @access  Private (Artisan only)
export const getMyProducts = async (req, res, next) => {
  try {
    const artisanId = req.user._id;
    const { status, search } = req.query;

    const query = { artisan: artisanId };
    if (status && status !== 'all') {
      if (status === 'published') query.isPublished = true;
      if (status === 'draft') query.isPublished = false;
    }
    if (search) {
      query.name = new RegExp(search, 'i');
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new product by the authenticated artisan
// @route   POST /api/artisan/products
// @access  Private (Artisan only)
export const createProduct = async (req, res, next) => {
  try {
    // ALWAYS bind authenticated artisan from JWT, never trust body
    const artisanId = req.user._id;

    const {
      name,
      shortDescription,
      descriptionEnglish,
      descriptionHindi,
      category,
      subcategory,
      material,
      color,
      craftType,
      tags = [],
      seoKeywords = [],
      originalImage,
      enhancedImage,
      additionalImages = [],
      rawMaterialCost = 0,
      laborCost = 0,
      packagingCost = 0,
      otherCost = 0,
      suggestedPrice = 0,
      suggestedMinPrice = 0,
      suggestedMaxPrice = 0,
      sellingPrice,
      stock = 1,
      status = 'draft'
    } = req.body;

    if (!name || !descriptionEnglish || !category || !originalImage || !sellingPrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, category, image, and selling price.'
      });
    }

    const product = await Product.create({
      artisan: artisanId,
      name,
      shortDescription,
      descriptionEnglish,
      descriptionHindi,
      category,
      subcategory,
      material,
      color,
      craftType,
      tags,
      seoKeywords,
      originalImage,
      enhancedImage,
      additionalImages,
      rawMaterialCost,
      laborCost,
      packagingCost,
      otherCost,
      suggestedPrice,
      suggestedMinPrice,
      suggestedMaxPrice,
      sellingPrice,
      stock,
      status,
      isPublished: status === 'published'
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a product (Ownership verified)
// @route   PUT /api/artisan/products/:id
// @access  Private (Artisan only)
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const artisanId = req.user._id;

    // Verify ownership
    const product = await Product.findOne({ _id: id, artisan: artisanId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or you are not authorized to edit this listing.'
      });
    }

    // Allowed update fields
    const updatableFields = [
      'name',
      'shortDescription',
      'descriptionEnglish',
      'descriptionHindi',
      'category',
      'subcategory',
      'material',
      'color',
      'craftType',
      'tags',
      'seoKeywords',
      'originalImage',
      'enhancedImage',
      'additionalImages',
      'rawMaterialCost',
      'laborCost',
      'packagingCost',
      'otherCost',
      'suggestedPrice',
      'suggestedMinPrice',
      'suggestedMaxPrice',
      'sellingPrice',
      'stock',
      'status'
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    if (req.body.status) {
      product.isPublished = req.body.status === 'published';
    }

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a product (Ownership verified)
// @route   DELETE /api/artisan/products/:id
// @access  Private (Artisan only)
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const artisanId = req.user._id;

    const product = await Product.findOneAndDelete({ _id: id, artisan: artisanId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or you do not have permission to delete it.'
      });
    }

    res.json({
      success: true,
      message: 'Product listing removed successfully.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle product publish status
// @route   POST /api/artisan/products/:id/publish
// @access  Private (Artisan only)
export const togglePublish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const artisanId = req.user._id;

    const product = await Product.findOne({ _id: id, artisan: artisanId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unauthorized.'
      });
    }

    product.isPublished = !product.isPublished;
    product.status = product.isPublished ? 'published' : 'draft';
    await product.save();

    res.json({
      success: true,
      message: `Product successfully ${product.isPublished ? 'published to marketplace' : 'moved to drafts'}.`,
      isPublished: product.isPublished,
      status: product.status
    });
  } catch (err) {
    next(err);
  }
};
