const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId })
      .populate('items.product', 'name price images stock isActive')
      .populate('items.prescription');
    
    if (!cart) {
      return res.json({ items: [], totalItems: 0, totalAmount: 0 });
    }
    
    // Filter out inactive products
    cart.items = cart.items.filter(item => item.product && item.product.isActive);
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, prescription, customizations } = req.body;
    
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found or inactive' });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }
    
    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId && 
      (!prescription || item.prescription?.toString() === prescription)
    );
    
    if (existingItemIndex > -1) {
      // Update existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({ message: 'Insufficient stock for total quantity' });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        prescription,
        customizations,
        priceAtAdd: product.finalPrice || product.price
      });
    }
    
    await cart.save();
    await cart.populate('items.product', 'name price images stock');    
    res.json({ message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity, customizations } = req.body;
    
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    const item = cart.items[itemIndex];
    const product = await Product.findById(item.product);
    
    if (quantity !== undefined) {
      if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than 0' });
      }
      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      item.quantity = quantity;
    }
    
    if (customizations) {
      item.customizations = { ...item.customizations, ...customizations };
    }
    
    await cart.save();
    await cart.populate('items.product', 'name price images stock');
    
    res.json({ message: 'Cart item updated', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    cart.items.splice(itemIndex, 1);
    await cart.save();
    await cart.populate('items.product', 'name price images stock');
    
    res.json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = [];
    await cart.save();
    
    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.moveToWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;
    const User = require('../models/User');
    
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    const item = cart.items[itemIndex];
    
    // Add to wishlist
    await User.findByIdAndUpdate(req.user.userId, {
      $addToSet: { wishlist: item.product }
    });
    
    // Remove from cart
    cart.items.splice(itemIndex, 1);
    await cart.save();
    await cart.populate('items.product', 'name price images stock');
    
    res.json({ message: 'Item moved to wishlist', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCartSummary = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.json({ totalItems: 0, totalAmount: 0, itemCount: 0 });
    }
    
    res.json(cart.summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};