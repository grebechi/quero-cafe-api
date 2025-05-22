const pool = require('../db');

async function createCoffee(req, res) {
  const trainee_id = req.user.id;
  const { request_id } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO coffee (trainee_id, request_id) VALUES (?, ?)',
      [trainee_id, request_id || null]
    );

    res.status(201).json({ message: 'Coffee recorded', coffee_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error recording coffee' });
  }
}


async function getCoffeesToday(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT c.*, p.name AS trainee_name
       FROM coffee c
       JOIN people p ON c.trainee_id = p.id
       WHERE DATE(c.date_created) = CURDATE()
       ORDER BY c.date_created ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching today's coffees" });
  }
}


async function getLastCoffee(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM coffee ORDER BY date_created DESC LIMIT 1`
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'No coffee records found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching last coffee' });
  }
}

async function getCoffeesByTrainee(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM coffee WHERE trainee_id = ? ORDER BY date_created DESC`,
      [id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching coffees by trainee' });
  }
}

module.exports = { createCoffee, getCoffeesToday, getLastCoffee, getCoffeesByTrainee };
