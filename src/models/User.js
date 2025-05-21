const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, required: true },
    name: String,
    email: { type: String, unique: true, required: true },
    profilePicture: String,
    createdAt: { type: Date, default: Date.now },
    // Adicionar outros campos de usuário, como trilhas favoritas, etc.
});

module.exports = mongoose.model('User', userSchema);