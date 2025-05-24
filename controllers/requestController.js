const pool = require('../db');
const { DateTime } = require('luxon');
const { getEffectiveCooldown, getEffectiveMaxRequestsPerDay } = require('../services/cooldownService');
const { checkDailyLimit } = require('../services/limitsService');

async function createRequest(req, res) {
  const person_id = req.user.id;

  try {
    //1) Obter limites e cooldown
    const COOLDOWN_MINUTES = await getEffectiveCooldown(person_id);
    const MAX_REQUESTS_PER_DAY = await getEffectiveMaxRequestsPerDay(person_id);

    //2) Verifica limite diário
    await checkDailyLimit('request', 'person_id', person_id, MAX_REQUESTS_PER_DAY);

    //3) Verifica cooldown
    const [rows] = await pool.execute(
      'SELECT date_created FROM request ORDER BY date_created DESC LIMIT 1'
    );

    if (rows.length > 0) {
      console.log(`Data bruta do banco (rows[0].date_created):`, rows[0].date_created);

      const last = DateTime.fromJSDate(rows[0].date_created);
      const now = DateTime.now();

      const diffInMinutes = now.diff(last, 'minutes').minutes;

      if (diffInMinutes < COOLDOWN_MINUTES) {
        const remaining = Math.ceil(COOLDOWN_MINUTES - diffInMinutes);

        return res.status(429).json({ 
          error: `Aguarde ${remaining} minutos antes de um novo pedido.`,
          lastRequest: last.toISO(),
          cooldown: COOLDOWN_MINUTES,
          remaining
        });
      } else {
        console.log(`Cooldown expirado: seguindo com criação da requisição.`);
      }
    } else {
      console.log(`Nenhuma requisição anterior encontrada: criando primeira requisição.`);
    }

    //4) Criação da requisição
    const [result] = await pool.execute(
      'INSERT INTO request (person_id) VALUES (?)',
      [person_id]
    );

    res.status(201).json({ message: 'Request created', request_id: result.insertId });
  } catch (err) {
    console.error('Erro ao criar requisição:', err);

    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }

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
    console.error('Erro ao buscar requisições:', err);
    res.status(500).json({ error: 'Error fetching your requests' });
  }
}

module.exports = { createRequest, getMyRequests };
