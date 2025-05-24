const pool = require('../db');
const { DateTime } = require('luxon');
const { getEffectiveCooldown, getEffectiveMaxCoffeesPerDay } = require('../services/cooldownService');
const { checkDailyLimit } = require('../services/limitsService');

async function createCoffee(req, res) {
  const trainee_id = req.user.id;
  const { request_id } = req.body;

  try {
    //1) Obter limites
    const COOLDOWN_MINUTES = await getEffectiveCooldown(trainee_id);
    const MAX_COFFEES_PER_DAY = await getEffectiveMaxCoffeesPerDay(trainee_id);

    //2) Verificar limite diário
    await checkDailyLimit('coffee', 'trainee_id', trainee_id, MAX_COFFEES_PER_DAY);

    //3) Verificar cooldown
    const [rows] = await pool.execute(
      'SELECT date_created FROM coffee ORDER BY date_created DESC LIMIT 1'
    );

    if (rows.length > 0) {
      console.log(`Data bruta do banco (rows[0].date_created):`, rows[0].date_created);

      const last = DateTime.fromJSDate(rows[0].date_created);
      const now = DateTime.now();

      const diffInMinutes = now.diff(last, 'minutes').minutes;

      if (diffInMinutes < COOLDOWN_MINUTES) {
        const remaining = Math.ceil(COOLDOWN_MINUTES - diffInMinutes);

        return res.status(429).json({ 
          error: `Aguarde ${remaining} minutos antes de marcar outro café.`,
          lastCoffee: last.toISO(),
          cooldown: COOLDOWN_MINUTES,
          remaining
        });
      } else {
        console.log(`Cooldown expirado: seguindo com marcação do café.`);
      }
    } else {
      console.log(`Nenhuma marcação de café anterior encontrada: criando primeira marcação.`);
    }

    //4) Inserção
    const [result] = await pool.execute(
      'INSERT INTO coffee (trainee_id, request_id) VALUES (?, ?)',
      [trainee_id, request_id || null]
    );

    res.status(201).json({ message: 'Café registrado', coffee_id: result.insertId });
  } catch (err) {
    console.error('Erro ao registrar café:', err);

    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }

    res.status(500).json({ error: 'Erro ao registrar café' });
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
