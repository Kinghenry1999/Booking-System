const express = require('express');
const router = express.Router();
const { getAdminStats, getAnalytics } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else res.status(403).json({ message: 'Admin only' });
};

router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/analytics', protect, adminOnly, getAnalytics);

module.exports = router;