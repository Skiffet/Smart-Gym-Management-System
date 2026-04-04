const mongoose = require('mongoose');

const trainingRecordSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  notes: {
    type: String,
    default: '',
  },
  exercises: [{
    name: { type: String, required: true },
    sets: { type: Number },
    reps: { type: Number },
    weight: { type: Number },
    duration: { type: Number },
  }],
  performance: {
    type: String,
    enum: ['excellent', 'good', 'average', 'needs_improvement'],
    default: 'good',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('TrainingRecord', trainingRecordSchema);
