const pool = require('../config/db');

exports.getAdminStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const providersCount = (await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['provider'])).rows[0].count;
    const servicesCount = (await pool.query('SELECT COUNT(*) FROM services WHERE is_active = true')).rows[0].count;

    const bookingsResult = await pool.query(`
      SELECT
        COUNT(*)::int AS total_bookings,
        COUNT(*) FILTER (WHERE status = 'confirmed')::int AS upcoming_bookings,
        COUNT(*) FILTER (WHERE status = 'completed')::int AS completed_bookings,
        COUNT(*) FILTER (WHERE status = 'cancelled')::int AS cancelled_bookings
      FROM bookings
    `);
    const bookings = bookingsResult.rows[0];

    const revenueResult = await pool.query(`
      SELECT COALESCE(SUM(s.price), 0) AS total_revenue
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.status = 'completed'
    `);
    const revenue = parseFloat(revenueResult.rows[0].total_revenue);

    res.json({
      providers: parseInt(providersCount),
      services: parseInt(servicesCount),
      totalBookings: bookings.total_bookings,
      upcomingBookings: bookings.upcoming_bookings,
      completedBookings: bookings.completed_bookings,
      cancelledBookings: bookings.cancelled_bookings,
      revenue: revenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // 1. Bookings per month (last 6 months)
    const monthlyBookings = await pool.query(`
      SELECT
        TO_CHAR(DATE_TRUNC('month', start_time), 'Mon YYYY') AS month,
        COUNT(*)::int AS count
      FROM bookings
      WHERE start_time >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', start_time)
      ORDER BY DATE_TRUNC('month', start_time) ASC
    `);

    // 2. Revenue per service (completed only)
    const revenueByService = await pool.query(`
      SELECT
        s.name,
        COALESCE(SUM(s.price), 0)::float AS revenue
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.status = 'completed'
      GROUP BY s.name
      ORDER BY revenue DESC
    `);

    // 3. Bookings per provider
    const bookingsByProvider = await pool.query(`
      SELECT
        u.name AS provider_name,
        COUNT(*)::int AS bookings
      FROM bookings b
      JOIN users u ON b.provider_id = u.id
      GROUP BY u.name
      ORDER BY bookings DESC
    `);

    res.json({
      monthlyBookings: monthlyBookings.rows,
      revenueByService: revenueByService.rows,
      bookingsByProvider: bookingsByProvider.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};