const mongoose = require('mongoose');

const trailSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    location: String, // Nome da cidade/parque
    latitude: Number,
    longitude: Number,
    difficulty: { type: String, enum: ['easy', 'moderate', 'hard'], default: 'easy' },
    durationHours: Number, // Duração estimada em horas
    distanceKm: Number, // Distância em km
    elevationGainMeters: Number,
    images: [String],
    pointsOfInterest: [String],
    // Adicionar outros campos relevantes
});

module.exports = mongoose.model('Trail', trailSchema);