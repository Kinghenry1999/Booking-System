const pool = require('../config/db');

const User = {
  async initTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer','provider','admin')),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await pool.query(query);
  },

  async create({ name, email, password, role = 'customer' }) {
    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at
    `;
    const values = [name, email, password, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  async findById(id) {
    const query = 'SELECT id, name, email, role, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findByRole(role) {
    const query = 'SELECT id, name, email, role, created_at FROM users WHERE role = $1';
    const result = await pool.query(query, [role]);
    return result.rows;
  }
};

module.exports = User;