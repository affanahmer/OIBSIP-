const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: Array, default: [] },
  customPizza: {
    base: { type: Object },
    sauce: { type: Object },
    cheese: { type: Object },
    veggies: { type: Array, default: [] }
  },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, default: 'Pending' },
  orderStatus: { type: String, enum: ['Order Received', 'In Kitchen', 'Sent to Delivery'], default: 'Order Received' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
