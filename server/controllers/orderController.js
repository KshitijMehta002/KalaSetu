import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order with server-side price recalculation
// @route   POST /api/orders
// @access  Private (Customer / Artisan / Admin)
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod = 'COD' } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Please add items to place an order.'
      });
    }

    if (
      !shippingAddress?.fullName ||
      !shippingAddress?.phone ||
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !shippingAddress?.pinCode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all shipping address fields (Name, Phone, Address, City, State, PIN).'
      });
    }

    // Security Rule: Recalculate prices from Database, NEVER trust client prices
    let serverSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product?._id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name || item.productId}`
        });
      }

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const itemPrice = product.sellingPrice;
      serverSubtotal += itemPrice * qty;

      validatedItems.push({
        product: product._id,
        artisan: product.artisan,
        name: product.name,
        quantity: qty,
        price: itemPrice,
        image: product.originalImage
      });

      // Reduce inventory stock
      if (product.stock >= qty) {
        product.stock -= qty;
        await product.save();
      }
    }

    const shippingFee = 0; // Free direct artisan shipping
    const totalAmount = serverSubtotal + shippingFee;
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `KS-${Date.now().toString().slice(-4)}-${randomSuffix}`;

    const order = await Order.create({
      orderNumber,
      customer: req.user._id,
      items: validatedItems,
      shippingAddress,
      subtotal: serverSubtotal,
      shippingFee,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'ONLINE_MOCK' ? 'paid' : 'pending',
      orderStatus: 'Confirmed'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! 100% of proceeds go directly to rural artisans.',
      order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get customer order history
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('items.artisan', 'name businessName phone state')
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

// @desc    Get orders containing artisan's products
// @route   GET /api/artisan/orders
// @access  Private (Artisan only)
export const getArtisanOrders = async (req, res, next) => {
  try {
    const artisanId = req.user._id;

    const orders = await Order.find({ 'items.artisan': artisanId })
      .populate('customer', 'name email phone')
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

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Artisan / Admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed statuses: ${allowedStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Check authorization: Admin or Artisan whose product is in the order
    if (req.user.role !== 'admin') {
      const isArtisanItem = order.items.some(
        (item) => item.artisan.toString() === req.user._id.toString()
      );
      if (!isArtisanItem) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden. You cannot manage this order.'
        });
      }
    }

    order.orderStatus = status;
    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (err) {
    next(err);
  }
};
