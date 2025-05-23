const pool = require('../db');

async function createRequest(req, res) {
  const person_id = req.user.id;
  const COOLDOWN_MINUTES = parseInt(process.env.REQUEST_COOLDOWN_MINUTES) || 5;

  try {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) AS recent_requests
       FROM request
       WHERE date_created >= NOW() - INTERVAL ? MINUTE`,
      [COOLDOWN_MINUTES]
    );

    const recentRequests = rows[0].recent_requests;

    if (recentRequests > 0) {
      return res.status(429).json({
        error: `Aguarde ${COOLDOWN_MINUTES} minutos antes de um novo pedido.`
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO request (person_id) VALUES (?)',
      [person_id]
    );

    res.status(201).json({ message: 'Request created', request_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating request' });
  }
}



async function getMyRequests(req, res) {
  const person_id = req.user.id;

  try {
    const [rows] = await pool.execute(
      `SELECT * FROM request WHERE person_id = ? ORDER BY date_created DESC`,
      [person_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching your requests' });
  }
}


module.exports = { createRequest, getMyRequests };
