const express = require('express');
const router = express.Router();
const { getAllServices, getServiceById, createService, updateService, deleteService, getMyServices } = require('../controllers/serviceController');
const { protect } = require('../middlewares/authMiddleware');
const adminOnly = (req, res, next) => (req.user && req.user.role === 'admin') ? next() : res.status(403).json({ message: 'Admin only' });

router.get('/', getAllServices);
router.get('/mine', protect, getMyServices); // provider's own services
router.get('/:id', getServiceById);
router.post('/', protect, adminOnly, createService);
router.put('/:id', protect, adminOnly, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;