const pool = require('../db');

async function createRequest(req, res) {
  const { person_id } = req.body;
  try {
    const [rows] = await pool.execute(
      'SELECT date_created FROM request WHERE person_id = ? ORDER BY date_created DESC LIMIT 1',
      [person_id]
    );
    if (rows.length > 0) {
      const last = new Date(rows[0].date_created);
      const now = new Date();
      if ((now - last) / (1000 * 60) < 5) {
        return res.status(429).json({ error: 'Wait 5 minutes before a new request' });
      }
    }
    const [result] = await pool.execute(
      'INSERT INTO request (person_id) VALUES (?)',
      [person_id]
    );
    res.status(201).json({ message: 'Request created', request_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Error creating request' });
  }
}

async function getRequestsByPerson(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM request WHERE person_id = ? ORDER BY date_created DESC`,
      [id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching requests by person' });
  }
}

module.exports = { createRequest, getRequestsByPerson };
