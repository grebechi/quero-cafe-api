const pool = require('../db');

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
    cooldown = 5;  // Fallback padrão
  }

  return cooldown;
}

module.exports = { getEffectiveCooldown };
