const pool = require('../db');

async function createCoffee(req, res) {
  const { trainee_id, request_id } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO coffee (trainee_id, request_id) VALUES (?, ?)',
      [trainee_id, request_id || null]
    );
    res.status(201).json({ message: 'Coffee recorded', coffee_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Error recording coffee' });
  }
}

module.exports = { createCoffee };
