const User = require('../models/User');
const bcrypt = require('bcryptjs');
const {
  sendEmail,
  providerWelcome,
  providerSuspended,
  providerDeleted,
  providerReactivated,
} = require('../utils/emailService');

// Helper: fetch provider name & email even if soft‑deleted (the table still has it)
const getProviderInfo = async (id) => {
  const query = "SELECT name, email FROM users WHERE id = $1 AND role = 'provider'";
  const { rows } = await require('../config/db').query(query, [id]);
  return rows[0] || null;
};

exports.getProviders = async (req, res) => {
  try {
    const providers = await User.findAllProviders();
    res.json(providers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProvider = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword, role: 'provider' });

    // Welcome email (non‑blocking)
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to Kinghenry Writes – Provider Account',
        html: providerWelcome({ name, email, password }),
      });
    } catch (emailErr) {
      console.error('Failed to send provider welcome email:', emailErr);
    }

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Soft delete
exports.deleteProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await getProviderInfo(id);
    await User.softDelete(id);

    if (provider) {
      try {
        await sendEmail({
          to: provider.email,
          subject: 'Your Kinghenry Writes account has been deactivated',
          html: providerDeleted(provider),
        });
      } catch (emailErr) {
        console.error('Failed to send deactivation email:', emailErr);
      }
    }

    res.json({ message: 'Provider deactivated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Restore
exports.restoreProvider = async (req, res) => {
  try {
    const { id } = req.params;
    await User.restore(id);
    const provider = await getProviderInfo(id);

    if (provider) {
      try {
        await sendEmail({
          to: provider.email,
          subject: 'Your Kinghenry Writes account has been reactivated',
          html: providerReactivated(provider),
        });
      } catch (emailErr) {
        console.error('Failed to send reactivation email:', emailErr);
      }
    }

    res.json({ message: 'Provider restored' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Suspend
exports.suspendProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { until } = req.body;
    const provider = await getProviderInfo(id);
    await User.suspend(id, until || null);

    if (provider) {
      try {
        await sendEmail({
          to: provider.email,
          subject: 'Your Kinghenry Writes account has been suspended',
          html: providerSuspended(provider, until || null),
        });
      } catch (emailErr) {
        console.error('Failed to send suspension email:', emailErr);
      }
    }

    res.json({ message: 'Provider suspended' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Unsuspend
exports.unsuspendProvider = async (req, res) => {
  try {
    const { id } = req.params;
    await User.unsuspend(id);
    const provider = await getProviderInfo(id);

    if (provider) {
      try {
        await sendEmail({
          to: provider.email,
          subject: 'Your Kinghenry Writes account has been reactivated',
          html: providerReactivated(provider),
        });
      } catch (emailErr) {
        console.error('Failed to send reactivation email:', emailErr);
      }
    }

    res.json({ message: 'Provider unsuspended' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};