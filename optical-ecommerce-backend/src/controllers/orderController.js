const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Place order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentId, notes } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }
    
    // Validate products and calculate total
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product ${item.product} not found or inactive` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      
      const itemTotal = (product.finalPrice || product.price) * item.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        price: product.finalPrice || product.price,
        prescription: item.prescription,
        customizations: item.customizations
      });
      
      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }
    
    const order = new Order({
      userId: req.user.userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentId,
      notes,
      paymentStatus: paymentId ? 'paid' : 'pending'
    });
    
    await order.save();
    await order.populate('items.product userId');
    
    // Clear cart after successful order
    await Cart.findOneAndUpdate(
      { user: req.user.userId },
      { $set: { items: [] } }
    );
    
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { userId: req.user.userId };
    
    if (status) filter.orderStatus = status;
    
    const orders = await Order.find(filter)
      .populate('items.product', 'name images price')
      .populate('items.prescription')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments(filter);
    
    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order for user
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    })
      .populate('items.product')
      .populate('items.prescription');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, userId, startDate, endDate } = req.query;
    const filter = {};
    
    if (status) filter.orderStatus = status;
    if (userId) filter.userId = userId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    const orders = await Order.find(filter)
      .populate('items.product', 'name price')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments(filter);
    
    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber, estimatedDelivery } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    
    await order.save();
    await order.populate('items.product userId');
    
    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user owns the order
    if (order.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (['shipped', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'Cannot cancel shipped or delivered order' });
    }
    
    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }
    
    order.orderStatus = 'cancelled';
    await order.save();
    
    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};