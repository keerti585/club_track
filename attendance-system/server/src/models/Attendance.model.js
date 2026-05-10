const mongoose = require('mongoose');
const { Schema } = mongoose;

const attendanceSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    method: {
        type: String,
        enum: ["QR", "MANUAL"],
        default: "QR"
    },
    markedAt: { type: Date, default: Date.now },
    markedBy: { type: Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
