const Booking = require('../models/Booking');
const GymClass = require('../models/Class');

exports.createBooking = async (req, res) => {
  try {
    const { classId } = req.body;

    const gymClass = await GymClass.findById(classId);
    if (!gymClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    if (gymClass.currentEnrollment >= gymClass.capacity) {
      return res.status(400).json({ message: 'Class is full' });
    }

    const existingBooking = await Booking.findOne({
      member: req.user._id,
      classId,
      status: 'confirmed',
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this class' });
    }

    const booking = await Booking.create({
      member: req.user._id,
      classId,
    });

    gymClass.currentEnrollment += 1;
    await gymClass.save();

    const populatedBooking = await booking.populate([
      { path: 'member', select: 'name email' },
      { path: 'classId', select: 'name schedule trainer', populate: { path: 'trainer', select: 'name' } },
    ]);

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ member: req.user._id })
      .populate({
        path: 'classId',
        select: 'name schedule trainer category',
        populate: { path: 'trainer', select: 'name' },
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.member.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    const gymClass = await GymClass.findById(booking.classId);
    if (gymClass && gymClass.currentEnrollment > 0) {
      gymClass.currentEnrollment -= 1;
      await gymClass.save();
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('member', 'name email')
      .populate({
        path: 'classId',
        select: 'name schedule trainer',
        populate: { path: 'trainer', select: 'name' },
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClassBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ classId: req.params.classId, status: 'confirmed' })
      .populate('member', 'name email phone');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
