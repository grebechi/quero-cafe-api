const pool = require('../db');

const DEFAULT_COOLDOWN_MINUTES = parseInt(process.env.DEFAULT_COOLDOWN_MINUTES) || 5;
const DEFAULT_MAX_REQUESTS_PER_DAY = parseInt(process.env.DEFAULT_MAX_REQUESTS_PER_DAY) || 10;
const DEFAULT_MAX_COFFEES_PER_DAY = parseInt(process.env.DEFAULT_MAX_COFFEES_PER_DAY) || 10;

async function getEffectiveCooldown(person_id) {
  const [rows] = await pool.execute(
    `SELECT 
        p.cooldown_minutes, 
        p.is_blocked, 
        p.blocked_reason,
        (SELECT value FROM settings WHERE key_name = 'cooldown_global' LIMIT 1) AS cooldown_global
     FROM people p
     WHERE p.id = ?`,
    [person_id]
  );

  if (rows.length === 0) {
    throw new Error('Usuário não encontrado');
  }

  const user = rows[0];

  if (user.is_blocked) {
    const reason = user.blocked_reason || 'sem motivo especificado';
    const err = new Error(`Usuário bloqueado: ${reason}`);
    err.status = 403;
    throw err;
  }

  let cooldown = null;

  if (user.cooldown_minutes !== null) {
    cooldown = user.cooldown_minutes;
  } else if (user.cooldown_global !== null) {
    cooldown = parseInt(user.cooldown_global, 10);
  } else {
    cooldown = DEFAULT_COOLDOWN_MINUTES;  // Fallback padrão via .env
  }

  return cooldown;
}

async function getEffectiveMaxRequestsPerDay(person_id) {
  const [rows] = await pool.execute(
    `SELECT 
        p.max_requests_per_day, 
        (SELECT value FROM settings WHERE key_name = 'max_requests_per_day_global' LIMIT 1) AS max_requests_global
     FROM people p
     WHERE p.id = ?`,
    [person_id]
  );

  if (rows.length === 0) {
    throw new Error('Usuário não encontrado');
  }

  const user = rows[0];

  let max = null;

  if (user.max_requests_per_day !== null) {
    max = user.max_requests_per_day;
  } else if (user.max_requests_global !== null) {
    max = parseInt(user.max_requests_global, 10);
  } else {
    max = DEFAULT_MAX_REQUESTS_PER_DAY;  // Fallback
  }

  return max;
}

async function getEffectiveMaxCoffeesPerDay(person_id) {
  const [rows] = await pool.execute(
    `SELECT 
        p.max_coffees_per_day, 
        (SELECT value FROM settings WHERE key_name = 'max_coffees_per_day_global' LIMIT 1) AS max_coffees_global
     FROM people p
     WHERE p.id = ?`,
    [person_id]
  );

  if (rows.length === 0) {
    throw new Error('Usuário não encontrado');
  }

  const user = rows[0];

  let max = null;

  if (user.max_coffees_per_day !== null) {
    max = user.max_coffees_per_day;
  } else if (user.max_coffees_global !== null) {
    max = parseInt(user.max_coffees_global, 10);
  } else {
    max = DEFAULT_MAX_COFFEES_PER_DAY;  // Fallback
  }

  return max;
}

module.exports = { 
  getEffectiveCooldown, 
  getEffectiveMaxRequestsPerDay, 
  getEffectiveMaxCoffeesPerDay 
};
