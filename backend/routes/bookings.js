const express = require('express');
const router = express.Router();
const {
  createBooking, getMyBookings, cancelBooking, getAllBookings, getClassBookings,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('member'), createBooking);
router.get('/my-bookings', authorize('member'), getMyBookings);
router.put('/:id/cancel', authorize('member'), cancelBooking);
router.get('/all', authorize('admin'), getAllBookings);
router.get('/class/:classId', authorize('admin', 'trainer'), getClassBookings);

module.exports = router;
