import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

// @desc    Get published products for marketplace with faceted filters & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      material,
      craftType,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const query = { isPublished: true };

    // Full-text or regex search
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { craftType: regex },
        { material: regex },
        { category: regex },
        { descriptionEnglish: regex },
        { tags: { $in: [regex] } }
      ];
    }

    if (category && category !== 'all') {
      query.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    if (material && material !== 'all') {
      query.material = new RegExp(material.trim(), 'i');
    }

    if (craftType && craftType !== 'all') {
      query.craftType = new RegExp(craftType.trim(), 'i');
    }

    if (minPrice || maxPrice) {
      query.sellingPrice = {};
      if (minPrice) query.sellingPrice.$gte = Number(minPrice);
      if (maxPrice) query.sellingPrice.$lte = Number(maxPrice);
    }

    // Sort order
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low') {
      sortOptions = { sellingPrice: 1 };
    } else if (sort === 'price-high') {
      sortOptions = { sellingPrice: -1 };
    } else if (sort === 'popular') {
      sortOptions = { views: -1, rating: -1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageLimit = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const skip = (pageNum - 1) * pageLimit;

    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .populate('artisan', 'name businessName craftSpecialization state district profileImage')
        .sort(sortOptions)
        .skip(skip)
        .limit(pageLimit),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      count: products.length,
      totalCount,
      totalPages: Math.ceil(totalCount / pageLimit),
      currentPage: pageNum,
      products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product by slug (or ID fallback)
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Support both slug and mongo ObjectId
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
    const query = isObjectId ? { $or: [{ slug }, { _id: slug }] } : { slug };

    const product = await Product.findOne(query).populate(
      'artisan',
      'name businessName bio craftSpecialization state district profileImage phone'
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    // Increment views asynchronously
    Product.findByIdAndUpdate(product._id, { $inc: { views: 1 } }).exec();

    // Fetch up to 4 related products from the same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isPublished: true
    })
      .populate('artisan', 'name businessName state')
      .limit(4);

    res.json({
      success: true,
      product,
      relatedProducts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all categories with item counts
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    // Aggregate counts for published products by category
    const counts = await Product.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    counts.forEach(c => {
      countMap[c._id] = c.count;
    });

    const enrichedCategories = categories.map(cat => ({
      ...cat.toObject(),
      productCount: countMap[cat.name] || 0
    }));

    res.json({
      success: true,
      categories: enrichedCategories
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get featured artisans
// @route   GET /api/products/featured-artisans
// @access  Public
export const getFeaturedArtisans = async (req, res, next) => {
  try {
    const artisans = await User.find({ role: 'artisan' })
      .select('name businessName bio craftSpecialization state district profileImage createdAt')
      .limit(6);

    // Fetch sample products for each artisan
    const artisanData = await Promise.all(
      artisans.map(async (artisan) => {
        const sampleProducts = await Product.find({ artisan: artisan._id, isPublished: true })
          .select('name originalImage sellingPrice')
          .limit(3);
        return {
          ...artisan.toObject(),
          sampleProducts,
          productCount: await Product.countDocuments({ artisan: artisan._id })
        };
      })
    );

    res.json({
      success: true,
      artisans: artisanData
    });
  } catch (err) {
    next(err);
  }
};
