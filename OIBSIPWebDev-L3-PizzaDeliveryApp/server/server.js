require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const sendEmail = require('./utils/sendEmail');
const Inventory = require('./models/Inventory');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);

const seedDatabase = async () => {
  const count = await Inventory.countDocuments();
  if (count === 0) {
    const defaultItems = [
      { category: 'base', name: 'Thin Crust', stock: 50, price: 100, threshold: 20 },
      { category: 'base', name: 'Thick Crust', stock: 50, price: 120, threshold: 20 },
      { category: 'base', name: 'Cheese Burst', stock: 50, price: 150, threshold: 20 },
      { category: 'base', name: 'Whole Wheat', stock: 50, price: 110, threshold: 20 },
      { category: 'base', name: 'Gluten Free', stock: 50, price: 130, threshold: 20 },
      { category: 'sauce', name: 'Tomato', stock: 50, price: 20, threshold: 20 },
      { category: 'sauce', name: 'Pesto', stock: 50, price: 40, threshold: 20 },
      { category: 'sauce', name: 'BBQ', stock: 50, price: 30, threshold: 20 },
      { category: 'sauce', name: 'Garlic', stock: 50, price: 25, threshold: 20 },
      { category: 'sauce', name: 'Spicy', stock: 50, price: 20, threshold: 20 },
      { category: 'cheese', name: 'Mozzarella', stock: 50, price: 50, threshold: 20 },
      { category: 'cheese', name: 'Cheddar', stock: 50, price: 60, threshold: 20 },
      { category: 'cheese', name: 'Parmesan', stock: 50, price: 70, threshold: 20 },
      { category: 'veggie', name: 'Onion', stock: 50, price: 15, threshold: 20 },
      { category: 'veggie', name: 'Tomato', stock: 50, price: 15, threshold: 20 },
      { category: 'veggie', name: 'Bell Pepper', stock: 50, price: 20, threshold: 20 },
      { category: 'veggie', name: 'Olives', stock: 50, price: 30, threshold: 20 },
      { category: 'veggie', name: 'Jalapeno', stock: 50, price: 25, threshold: 20 }
    ];
    await Inventory.insertMany(defaultItems);
  }
  
  const adminCount = await User.countDocuments({ role: 'admin' });
  if (adminCount === 0) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_SECRET || 'admin123', salt);
    await User.create({
      name: 'Admin',
      email: 'admin@pizza.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true
    });
  }
};

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await seedDatabase();
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.log(err));

cron.schedule('0 * * * *', async () => {
  try {
    const lowStockItems = await Inventory.find({ $expr: { $lte: ['$stock', '$threshold'] } });
    if (lowStockItems.length > 0) {
      const itemsList = lowStockItems.map(item => `${item.name}: ${item.stock} left`).join('\n');
      await sendEmail({
        to: process.env.EMAIL_USER,
        subject: 'Low Stock Alert',
        text: `The following items are low on stock:\n\n${itemsList}`
      });
    }
  } catch (error) {}
});
