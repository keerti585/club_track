const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    type: {
        type: String,
        enum: ["WORKSHOP", "MEETING", "HACKATHON", "GENERAL"],
        default: "GENERAL"
    },
    status: {
        type: String,
        enum: ["DRAFT", "ACTIVE", "CLOSED"],
        default: "DRAFT"
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);
