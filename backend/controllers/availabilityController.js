const Availability = require('../models/Availability');

// GET – any authenticated user can view availability (scoped appropriately)
exports.getAvailability = async (req, res) => {
  try {
    const providerId = req.query.providerId || req.user.id;
    // Providers can only see their own
    if (req.user.role === 'provider' && parseInt(providerId) !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const slots = await Availability.findAllByProvider(providerId);
    res.json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST – ONLY ADMIN can save availability
exports.saveAvailability = async (req, res) => {
  try {
    // Strict admin check
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can set availability' });
    }

    const { slots, providerId } = req.body;
    if (!providerId) {
      return res.status(400).json({ message: 'providerId is required' });
    }

    if (!Array.isArray(slots)) {
      return res.status(400).json({ message: 'slots must be an array' });
    }

    for (const slot of slots) {
      if (slot.day_of_week === undefined || !slot.start_time || !slot.end_time) {
        return res.status(400).json({ message: 'Invalid slot data' });
      }
    }

    await Availability.replaceAllForProvider(providerId, slots);
    res.json({ message: 'Availability saved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};