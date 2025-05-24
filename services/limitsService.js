const pool = require('../db');

/**
 * Verifica se o usuário atingiu o limite diário de operações.
 * @param {string} table - Nome da tabela (ex: 'request', 'coffee').
 * @param {string} userField - Nome do campo do usuário (ex: 'person_id', 'trainee_id').
 * @param {number} userId - ID do usuário.
 * @param {number} maxPerDay - Máximo permitido por dia.
 */
async function checkDailyLimit(table, userField, userId, maxPerDay) {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM ${table} WHERE ${userField} = ? AND DATE(date_created) = CURDATE()`,
    [userId]
  );

  const total = rows[0].total;

  if (total >= maxPerDay) {
    const err = new Error(`Você já atingiu o limite diário de ${maxPerDay}.`);
    err.status = 429;
    throw err;
  }
}

module.exports = { checkDailyLimit };
