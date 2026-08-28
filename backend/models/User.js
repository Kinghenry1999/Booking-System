const pool = require('../config/db');

const User = {
  async initTable() {
    // Create table if not exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer','provider','admin')),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await pool.query(createTableQuery);

    // Add new columns if they don't exist (safe for existing tables)
    const addColumnQueries = [
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT false`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_until TIMESTAMP`,
    ];
    for (const q of addColumnQueries) {
      await pool.query(q);
    }
  },

  async create({ name, email, password, role = 'customer' }) {
    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, is_active, is_suspended, suspended_until, created_at
    `;
    const values = [name, email, password, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  async findById(id) {
    const query = 'SELECT id, name, email, role, is_active, is_suspended, suspended_until, created_at FROM users WHERE id = $1 AND is_active = true';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findByRole(role) {
    const query = 'SELECT id, name, email, role, is_active, is_suspended, suspended_until, created_at FROM users WHERE role = $1 AND is_active = true ORDER BY name';
    const result = await pool.query(query, [role]);
    return result.rows;
  },

  // Admin: get all providers (including suspended & soft-deleted)
  async findAllProviders() {
    const query = 'SELECT id, name, email, role, is_active, is_suspended, suspended_until, created_at FROM users WHERE role = \'provider\' ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
  },

  // Soft delete (deactivate)
  async softDelete(id) {
    await pool.query('UPDATE users SET is_active = false WHERE id = $1', [id]);
  },

  // Restore a soft‑deleted user
  async restore(id) {
    await pool.query('UPDATE users SET is_active = true WHERE id = $1', [id]);
  },

  // Suspend a user (until a given date, or indefinitely if null)
  async suspend(id, until = null) {
    if (until) {
      await pool.query('UPDATE users SET is_suspended = true, suspended_until = $2 WHERE id = $1', [id, until]);
    } else {
      await pool.query('UPDATE users SET is_suspended = true, suspended_until = NULL WHERE id = $1', [id]);
    }
  },

  // Unsuspend a user
  async unsuspend(id) {
    await pool.query('UPDATE users SET is_suspended = false, suspended_until = NULL WHERE id = $1', [id]);
  },

  // Check if a user is currently suspended (handles automatic expiry)
  async isSuspended(id) {
    const query = 'SELECT is_suspended, suspended_until FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    if (!result.rows[0]) return false;
    const { is_suspended, suspended_until } = result.rows[0];
    if (!is_suspended) return false;
    // If the suspension has an end date and it has passed, lift suspension automatically
    if (suspended_until && new Date() > new Date(suspended_until)) {
      await pool.query('UPDATE users SET is_suspended = false, suspended_until = NULL WHERE id = $1', [id]);
      return false;
    }
    return true;
  }
};

module.exports = User;