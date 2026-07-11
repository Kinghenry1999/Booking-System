const express = require('express');
const router = express.Router();
const { getAvailability, saveAvailability } = require('../controllers/availabilityController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getAvailability);
router.post('/', protect, saveAvailability);   // admin-only logic inside controller

module.exports = router;