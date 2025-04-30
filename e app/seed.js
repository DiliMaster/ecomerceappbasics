const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedProducts = async () => {
    const products = [
        { name: 'Product 1', description: 'Description for Product 1', price: 10.00, image_url: 'https://via.placeholder.com/200', stock: 100, category: 'Category 1' },
        { name: 'Product 2', description: 'Description for Product 2', price: 15.00, image_url: 'https://via.placeholder.com/200', stock: 50, category: 'Category 2' },
        { name: 'Product 3', description: 'Description for Product 3', price: 20.00, image_url: 'https://via.placeholder.com/200', stock: 30, category: 'Category 3' }
    ];

    try {
        await Product.deleteMany(); // Clear existing data
        await Product.insertMany(products);
        console.log('Database seeded with products');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedProducts();