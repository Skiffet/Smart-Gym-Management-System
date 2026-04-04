const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed',
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

bookingSchema.index({ member: 1, classId: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
