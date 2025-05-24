const pool = require('../db');
const { DateTime } = require('luxon');

async function createRequest(req, res) {
  const person_id = req.user.id;
  const COOLDOWN_MINUTES = parseInt(process.env.REQUEST_COOLDOWN_MINUTES) || 5;

  try {
    const [rows] = await pool.execute(
      'SELECT date_created FROM request ORDER BY date_created DESC LIMIT 1'
    );

    if (rows.length > 0) {
      console.log(`Data bruta do banco (rows[0].date_created):`, rows[0].date_created);
      console.log(`Tipo de date_created:`, typeof rows[0].date_created);

      const last = DateTime.fromJSDate(rows[0].date_created);
      const now = DateTime.now();

      console.log(`Interpretação com Luxon - last: ${last.toISO()}`);
      console.log(`Interpretação com Luxon - now: ${now.toISO()}`);

      const diffInMinutes = now.diff(last, 'minutes').minutes;

      console.log(`Diferença em minutos: ${diffInMinutes.toFixed(4)}`);
      console.log(`Cooldown configurado: ${COOLDOWN_MINUTES} minutos`);

      if (diffInMinutes < COOLDOWN_MINUTES) {
        console.log(`Rejeitando requisição: cooldown ainda não expirou.`);
        return res.status(429).json({ 
          error: `Aguarde ${Math.ceil(COOLDOWN_MINUTES - diffInMinutes)} minutos antes de um novo pedido.`,
          lastRequest: last.toISO(),
          cooldown: COOLDOWN_MINUTES
        });
      } else {
        console.log(`Cooldown expirado: seguindo com criação da requisição.`);
      }
    } else {
      console.log(`Nenhuma requisição anterior encontrada: criando primeira requisição.`);
    }

    const [result] = await pool.execute(
      'INSERT INTO request (person_id) VALUES (?)',
      [person_id]
    );

    console.log(`Requisição criada com sucesso: ID ${result.insertId}`);

    res.status(201).json({ message: 'Request created', request_id: result.insertId });
  } catch (err) {
    console.error('Erro ao criar requisição:', err);
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
