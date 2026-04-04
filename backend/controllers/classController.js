const GymClass = require('../models/Class');

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await GymClass.find()
      .populate('trainer', 'name email')
      .sort({ createdAt: -1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const gymClass = await GymClass.findById(req.params.id)
      .populate('trainer', 'name email');
    if (!gymClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(gymClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    const { name, description, trainer, schedule, capacity, category } = req.body;

    const gymClass = await GymClass.create({
      name,
      description,
      trainer,
      schedule,
      capacity,
      category,
    });

    const populatedClass = await gymClass.populate('trainer', 'name email');
    res.status(201).json(populatedClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const gymClass = await GymClass.findById(req.params.id);
    if (!gymClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    if (req.user.role === 'trainer' && gymClass.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this class' });
    }

    const updatedClass = await GymClass.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('trainer', 'name email');

    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const gymClass = await GymClass.findById(req.params.id);
    if (!gymClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    await gymClass.deleteOne();
    res.json({ message: 'Class removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTrainerClasses = async (req, res) => {
  try {
    const classes = await GymClass.find({ trainer: req.user._id })
      .populate('trainer', 'name email')
      .sort({ createdAt: -1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
