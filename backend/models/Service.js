const pool = require('../config/db');

const Service = {
  async initTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        duration INTEGER NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        provider_id INTEGER REFERENCES users(id)
      );
    `;
    await pool.query(createTableQuery);

    // Add provider_id column if it doesn't exist (for existing tables)
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='services' AND column_name='provider_id'
        ) THEN
          ALTER TABLE services ADD COLUMN provider_id INTEGER REFERENCES users(id);
        END IF;
      END $$;
    `);
  },

  async findAll() {
    const result = await pool.query(
      `SELECT s.*, u.name as provider_name 
       FROM services s 
       LEFT JOIN users u ON s.provider_id = u.id 
       WHERE s.is_active = true 
       ORDER BY s.name`
    );
    return result.rows;
  },

  async findByProviderId(providerId) {
    const result = await pool.query(
      'SELECT * FROM services WHERE provider_id = $1 AND is_active = true ORDER BY name',
      [providerId]
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create({ name, description, duration, price, provider_id }) {
    const query = `
      INSERT INTO services (name, description, duration, price, provider_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [name, description, duration, price, provider_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async update(id, { name, description, duration, price, is_active, provider_id }) {
    const query = `
      UPDATE services
      SET name = $1, description = $2, duration = $3, price = $4, is_active = $5, provider_id = $6
      WHERE id = $7
      RETURNING *
    `;
    const values = [name, description, duration, price, is_active, provider_id, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    await pool.query('UPDATE services SET is_active = false WHERE id = $1', [id]);
    return { message: 'Service deactivated' };
  }
};

module.exports = Service;