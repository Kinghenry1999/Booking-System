const pool = require('../config/db');

const Booking = {
  async initTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES users(id),
        service_id INTEGER REFERENCES services(id),
        provider_id INTEGER REFERENCES users(id),
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await pool.query(query);

    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='bookings' AND column_name='provider_id'
        ) THEN
          ALTER TABLE bookings ADD COLUMN provider_id INTEGER REFERENCES users(id);
        END IF;
      END $$;
    `);
  },

  async findByCustomerId(customerId) {
    const query = `
      SELECT b.*, s.name as service_name, s.duration, u.name as provider_name
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users u ON b.provider_id = u.id
      WHERE b.customer_id = $1
      ORDER BY b.start_time DESC
    `;
    const result = await pool.query(query, [customerId]);
    return result.rows;
  },

  async findByProviderId(providerId) {
    const query = `
      SELECT b.*, s.name as service_name, s.duration, u.name as customer_name
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users u ON b.customer_id = u.id
      WHERE b.provider_id = $1
      ORDER BY b.start_time DESC
    `;
    const result = await pool.query(query, [providerId]);
    return result.rows;
  },

  async findOverlapping(startTime, endTime, providerId) {
    const query = `
      SELECT * FROM bookings
      WHERE status = 'confirmed'
        AND provider_id = $3
        AND start_time < $2 AND end_time > $1
    `;
    const result = await pool.query(query, [startTime, endTime, providerId]);
    return result.rows;
  },

  async create({ customerId, serviceId, providerId, startTime, endTime }) {
    const query = `
      INSERT INTO bookings (customer_id, service_id, provider_id, start_time, end_time)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [customerId, serviceId, providerId, startTime, endTime];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async cancel(bookingId, userId, role) {
    let query;
    if (role === 'customer') {
      query = 'UPDATE bookings SET status = \'cancelled\' WHERE id = $1 AND customer_id = $2 RETURNING *';
    } else if (role === 'provider') {
      query = 'UPDATE bookings SET status = \'cancelled\' WHERE id = $1 AND provider_id = $2 RETURNING *';
    } else {
      return null;
    }
    const result = await pool.query(query, [bookingId, userId]);
    return result.rows[0];
  },

  async updateStatus(bookingId, providerId, status) {
    const query = 'UPDATE bookings SET status = $3 WHERE id = $1 AND provider_id = $2 RETURNING *';
    const result = await pool.query(query, [bookingId, providerId, status]);
    return result.rows[0];
  }
};

module.exports = Booking;