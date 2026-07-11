const express = require('express');
const router = express.Router();
const { getProviders, createProvider } = require('../controllers/providerController');
const { protect } = require('../middlewares/authMiddleware');
const adminOnly = (req, res, next) => (req.user && req.user.role === 'admin') ? next() : res.status(403).json({ message: 'Admin only' });

router.get('/', protect, adminOnly, getProviders);
router.post('/', protect, adminOnly, createProvider);

module.exports = router;