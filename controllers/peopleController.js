const pool = require('../db');
const bcrypt = require('bcrypt');

async function createPerson(req, res) {
  const { name, mail, pass, isTrainee, isAdmin } = req.body;
  try {
    const hashedPass = await bcrypt.hash(pass, 10);
    await pool.execute(
      'INSERT INTO people (name, mail, pass, isTrainee, isAdmin) VALUES (?, ?, ?, ?, ?)',
      [name, mail, hashedPass, isTrainee, isAdmin]
    );
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: 'Error creating user' });
  }
}

async function deletePerson(req, res) {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM people WHERE id = ?', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user' });
  }
}

module.exports = { createPerson, deletePerson };
