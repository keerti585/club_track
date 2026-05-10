const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accessCode: {
        type: String,
        unique: true,
        sparse: true
    },
    role: {
        type: String,
        enum: ["ADMIN", "VOLUNTEER", "MEMBER"],
        default: "MEMBER"
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
