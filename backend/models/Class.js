const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a class name'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please assign a trainer'],
  },
  schedule: {
    day: {
      type: String,
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  capacity: {
    type: Number,
    required: [true, 'Please add class capacity'],
    min: 1,
  },
  currentEnrollment: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    enum: ['Yoga', 'Cardio', 'Strength', 'HIIT', 'Pilates', 'Boxing', 'Dance', 'Other'],
    default: 'Other',
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Class', classSchema);
