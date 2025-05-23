const pool = require('../db');

async function createRequest(req, res) {
  const person_id = req.user.id;
  const COOLDOWN_MINUTES = parseInt(process.env.REQUEST_COOLDOWN_MINUTES) || 5;

  try {
    const [rows] = await pool.execute(
      'SELECT date_created FROM request ORDER BY date_created DESC LIMIT 1'
    );

    if (rows.length > 0) {
      const lastTimestamp = new Date(rows[0].date_created).getTime();
      const nowTimestamp = Date.now();

      const diffInMinutes = (nowTimestamp - lastTimestamp) / (1000 * 60);

      console.log('Última requisição:', new Date(lastTimestamp));
      console.log('Agora:', new Date(nowTimestamp));
      console.log('Diferença em minutos:', diffInMinutes);

      if (diffInMinutes < COOLDOWN_MINUTES) {
        return res.status(429).json({
          error: `Aguarde ${Math.ceil(COOLDOWN_MINUTES - diffInMinutes)} minutos antes de um novo pedido.`,
          lastRequest: new Date(lastTimestamp).toISOString(),
          remainingMinutes: Math.ceil(COOLDOWN_MINUTES - diffInMinutes)
        });
      }
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
