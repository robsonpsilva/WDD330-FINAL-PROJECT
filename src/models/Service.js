const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    type: { type: String, enum: ['guided_tour', 'training', 'rental', 'consulting'], required: true },
    price: Number, // Preço por sessão/dia/etc.
    availableDates: [Date], // Para agendamentos
    // Adicionar campos como guia_id, instrutor_id
});

module.exports = mongoose.model('Service', serviceSchema);