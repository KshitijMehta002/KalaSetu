import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema(
  {
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Product must belong to an artisan']
    },
    name: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [150, 'Product title cannot exceed 150 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
      default: ''
    },
    descriptionEnglish: {
      type: String,
      required: [true, 'English description is required'],
      trim: true
    },
    descriptionHindi: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    subcategory: {
      type: String,
      trim: true,
      default: ''
    },
    material: {
      type: String,
      trim: true,
      default: ''
    },
    color: {
      type: String,
      trim: true,
      default: ''
    },
    craftType: {
      type: String,
      trim: true,
      default: ''
    },
    tags: [{
      type: String,
      trim: true
    }],
    seoKeywords: [{
      type: String,
      trim: true
    }],

    // Images
    originalImage: {
      type: String,
      required: [true, 'At least one product image is required']
    },
    enhancedImage: {
      type: String,
      default: ''
    },
    additionalImages: [{
      type: String
    }],

    // Production Costs
    rawMaterialCost: {
      type: Number,
      default: 0,
      min: [0, 'Raw material cost cannot be negative']
    },
    laborCost: {
      type: Number,
      default: 0,
      min: [0, 'Labor cost cannot be negative']
    },
    packagingCost: {
      type: Number,
      default: 0,
      min: [0, 'Packaging cost cannot be negative']
    },
    otherCost: {
      type: Number,
      default: 0,
      min: [0, 'Other cost cannot be negative']
    },
    totalProductionCost: {
      type: Number,
      default: 0,
      min: [0, 'Total cost cannot be negative']
    },

    // AI Pricing
    suggestedPrice: {
      type: Number,
      default: 0
    },
    suggestedMinPrice: {
      type: Number,
      default: 0
    },
    suggestedMaxPrice: {
      type: Number,
      default: 0
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [1, 'Selling price must be greater than zero']
    },

    // Inventory & Status
    stock: {
      type: Number,
      default: 1,
      min: [0, 'Stock cannot be negative']
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    views: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Calculate totalProductionCost and slug before saving
productSchema.pre('save', function (next) {
  this.totalProductionCost =
    (Number(this.rawMaterialCost) || 0) +
    (Number(this.laborCost) || 0) +
    (Number(this.packagingCost) || 0) +
    (Number(this.otherCost) || 0);

  if (this.isModified('name') || !this.slug) {
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + randomSuffix;
  }

  // Keep isPublished and status in sync
  if (this.status === 'published') {
    this.isPublished = true;
  } else if (this.status === 'draft') {
    this.isPublished = false;
  }

  next();
});

// Index for search & filtering
productSchema.index({ name: 'text', descriptionEnglish: 'text', craftType: 'text', material: 'text', tags: 'text' });
productSchema.index({ category: 1, isPublished: 1, sellingPrice: 1 });
productSchema.index({ artisan: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
