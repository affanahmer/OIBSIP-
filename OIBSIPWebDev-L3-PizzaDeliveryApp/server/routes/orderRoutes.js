const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.post('/razorpay', verifyToken, orderController.createRazorpayOrder);
router.post('/verify', verifyToken, orderController.verifyAndSaveOrder);
router.get('/my-orders', verifyToken, orderController.getUserOrders);
router.get('/all', verifyToken, requireAdmin, orderController.getAllOrders);
router.put('/:id/status', verifyToken, requireAdmin, orderController.updateOrderStatus);

module.exports = router;
