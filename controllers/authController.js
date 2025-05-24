const pool = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function login(req, res) {
  const { mail, pass } = req.body;

  try {
    const [rows] = await pool.execute('SELECT * FROM people WHERE mail = ?', [mail]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = rows[0];

    const validPass = await bcrypt.compare(pass, user.pass);
    if (!validPass) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({
      id: user.id,
      isAdmin: user.isAdmin,
      isTrainee: user.isTrainee
    }, process.env.JWT_SECRET);

    const safeUser = {
      id: user.id,
      name: user.name,
      mail: user.mail,
      isAdmin: user.isAdmin,
      isTrainee: user.isTrainee,
      cooldown_minutes: user.cooldown_minutes,
      max_requests_per_day: user.max_requests_per_day,
      max_coffees_per_day: user.max_coffees_per_day,
      is_blocked: user.is_blocked,
      blocked_reason: user.blocked_reason
    };

    res.json({ token, user: safeUser });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login error' });
  }
}

module.exports = { login };
