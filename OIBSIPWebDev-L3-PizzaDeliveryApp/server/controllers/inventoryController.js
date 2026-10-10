const Inventory = require('../models/Inventory');

exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const item = await Inventory.findById(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.stock += amount;
    await item.save();
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLowStock = async (req, res) => {
  try {
    const items = await Inventory.find({ $expr: { $lte: ['$stock', '$threshold'] } });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
