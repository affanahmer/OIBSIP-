const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const Razorpay = require('razorpay');
const crypto = require('crypto');

exports.createRazorpayOrder = async (req, res) => {
  try {
    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    const { amount } = req.body;
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyAndSaveOrder = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, customPizza, totalAmount } = req.body;
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');
    
    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const { base, sauce, cheese, veggies } = customPizza;
    
    const itemsToDeduct = [];
    if (base) itemsToDeduct.push(base._id);
    if (sauce) itemsToDeduct.push(sauce._id);
    if (cheese) itemsToDeduct.push(cheese._id);
    veggies.forEach(v => itemsToDeduct.push(v._id));

    for (let itemId of itemsToDeduct) {
      const item = await Inventory.findById(itemId);
      if (!item || item.stock < 1) {
        return res.status(400).json({ message: `Insufficient stock for ${item ? item.name : 'item'}` });
      }
    }

    for (let itemId of itemsToDeduct) {
      await Inventory.findByIdAndUpdate(itemId, { $inc: { stock: -1 } });
    }

    const newOrder = new Order({
      userId: req.user.id,
      customPizza,
      totalAmount,
      paymentStatus: 'Paid',
      razorpayOrderId,
      razorpayPaymentId
    });
    await newOrder.save();
    
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { orderStatus: status }, { new: true });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
