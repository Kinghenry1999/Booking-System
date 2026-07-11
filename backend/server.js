const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const pool = require('./config/db');

// Models
const User = require('./models/User');
const Service = require('./models/Service');
const Availability = require('./models/Availability');
const Booking = require('./models/Booking');

// Routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const providerRoutes = require('./routes/providerRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Initialize database tables
User.initTable().then(() => console.log('Users table ready')).catch(console.error);
Service.initTable().then(() => console.log('Services table ready')).catch(console.error);
Availability.initTable().then(() => console.log('Availabilities table ready')).catch(console.error);
Booking.initTable().then(() => console.log('Bookings table ready')).catch(console.error);

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));