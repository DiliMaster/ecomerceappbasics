const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image_url: { type: String },
    stock: { type: Number, required: true },
    category: { type: String }
});

module.exports = mongoose.model('Product', ProductSchema);