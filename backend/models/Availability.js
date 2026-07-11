const pool = require('../config/db');

const Availability = {
  async initTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS availabilities (
        id SERIAL PRIMARY KEY,
        day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        provider_id INTEGER REFERENCES users(id)
      );
    `;
    await pool.query(createTableQuery);

    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='availabilities' AND column_name='provider_id'
        ) THEN
          ALTER TABLE availabilities ADD COLUMN provider_id INTEGER REFERENCES users(id);
        END IF;
      END $$;
    `);
  },

  async findByDayAndProvider(dayOfWeek, providerId) {
    const query = 'SELECT * FROM availabilities WHERE day_of_week = $1 AND provider_id = $2 AND is_active = true ORDER BY start_time';
    const result = await pool.query(query, [dayOfWeek, providerId]);
    return result.rows;
  },

  async findAllByProvider(providerId) {
    const result = await pool.query('SELECT * FROM availabilities WHERE provider_id = $1 ORDER BY day_of_week, start_time', [providerId]);
    return result.rows;
  },

  async replaceAllForProvider(providerId, slots) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM availabilities WHERE provider_id = $1', [providerId]);
      for (const slot of slots) {
        const { day_of_week, start_time, end_time } = slot;
        await client.query(
          'INSERT INTO availabilities (day_of_week, start_time, end_time, provider_id) VALUES ($1, $2, $3, $4)',
          [day_of_week, start_time, end_time, providerId]
        );
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async delete(id) {
    await pool.query('DELETE FROM availabilities WHERE id = $1', [id]);
  }
};

module.exports = Availability;