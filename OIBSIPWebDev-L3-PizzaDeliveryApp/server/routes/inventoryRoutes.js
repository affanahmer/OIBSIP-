const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.get('/', inventoryController.getInventory);
router.put('/:id', verifyToken, requireAdmin, inventoryController.updateStock);
router.get('/low-stock', verifyToken, requireAdmin, inventoryController.getLowStock);

module.exports = router;
