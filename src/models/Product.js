const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    imageUrl: String,
    stock: { type: Number, default: 0 },
    category: String, // Ex: 'mochilas', 'botas', 'bastões'
});

module.exports = mongoose.model('Product', productSchema);