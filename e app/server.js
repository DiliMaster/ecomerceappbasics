const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes and Models
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.post('/api/checkout', async (req, res) => {
    const { user_id, cart } = req.body;

    if (!cart || cart.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }

    try {
        // Calculate total price
        const orderItems = [];
        let totalPrice = 0;

        for (const item of cart) {
            const product = await Product.findById(item.product_id);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${product.name}` });
            }

            // Reduce stock
            product.stock -= item.quantity;
            await product.save();

            // Add to order items
            orderItems.push({
                product_id: product._id,
                quantity: item.quantity,
                price: product.price
            });
            totalPrice += item.quantity * product.price;
        }

        // Create order
        const order = new Order({
            user_id,
            items: orderItems,
            total_price: totalPrice
        });
        await order.save();

        res.json({ message: 'Order placed successfully', order });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process order' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});