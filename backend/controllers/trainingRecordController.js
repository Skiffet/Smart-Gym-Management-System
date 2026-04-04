const TrainingRecord = require('../models/TrainingRecord');

exports.createRecord = async (req, res) => {
  try {
    const { member, classId, date, notes, exercises, performance } = req.body;

    const record = await TrainingRecord.create({
      member,
      trainer: req.user._id,
      classId,
      date,
      notes,
      exercises,
      performance,
    });

    const populatedRecord = await record.populate([
      { path: 'member', select: 'name email' },
      { path: 'trainer', select: 'name email' },
      { path: 'classId', select: 'name' },
    ]);

    res.status(201).json(populatedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTrainerRecords = async (req, res) => {
  try {
    const records = await TrainingRecord.find({ trainer: req.user._id })
      .populate('member', 'name email')
      .populate('classId', 'name')
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMemberRecords = async (req, res) => {
  try {
    const records = await TrainingRecord.find({ member: req.user._id })
      .populate('trainer', 'name')
      .populate('classId', 'name')
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    const record = await TrainingRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    if (record.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this record' });
    }

    const updatedRecord = await TrainingRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'member', select: 'name email' },
      { path: 'trainer', select: 'name email' },
      { path: 'classId', select: 'name' },
    ]);

    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const record = await TrainingRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    if (req.user.role !== 'admin' && record.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await record.deleteOne();
    res.json({ message: 'Record removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllRecords = async (req, res) => {
  try {
    const records = await TrainingRecord.find()
      .populate('member', 'name email')
      .populate('trainer', 'name email')
      .populate('classId', 'name')
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
