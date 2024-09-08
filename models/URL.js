const mongoose = require('mongoose');

const URLSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    clickCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const URL = mongoose.model('URL', URLSchema);

module.exports = URL;
