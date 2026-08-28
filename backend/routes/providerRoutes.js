const express = require('express');
const router = express.Router();
const {
  getProviders,
  createProvider,
  deleteProvider,
  restoreProvider,
  suspendProvider,
  unsuspendProvider,
} = require('../controllers/providerController');
const { protect } = require('../middlewares/authMiddleware');

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else res.status(403).json({ message: 'Admin only' });
};

router.get('/', protect, adminOnly, getProviders);
router.post('/', protect, adminOnly, createProvider);
router.delete('/:id', protect, adminOnly, deleteProvider);           // soft delete
router.put('/:id/restore', protect, adminOnly, restoreProvider);    // restore
router.put('/:id/suspend', protect, adminOnly, suspendProvider);   // suspend
router.put('/:id/unsuspend', protect, adminOnly, unsuspendProvider); // unsuspend

module.exports = router;