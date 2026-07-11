const express = require('express');
const router = express.Router();
const {
  getAvailableSlots,
  createBooking,
  getMyBookings,
  cancelBooking,
  updateBookingStatus,
  getAllBookings,
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/available-slots/:serviceId', getAvailableSlots);
router.get('/all', protect, getAllBookings);
router.post('/', protect, createBooking);
router.get('/mine', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;