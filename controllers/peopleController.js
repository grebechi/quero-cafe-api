const pool = require('../db');
const bcrypt = require('bcrypt');

async function createPerson(req, res) {
  const { name, mail, pass, isTrainee, isAdmin } = req.body;
  try {
    const hashedPass = await bcrypt.hash(pass, 10);
    await pool.execute(
      'INSERT INTO people (name, mail, pass, isTrainee, isAdmin) VALUES (?, ?, ?, ?, ?)',
      [name, mail, hashedPass, isTrainee, isAdmin]
    );
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: 'Error creating user' });
  }
}

async function deletePerson(req, res) {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM people WHERE id = ?', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user' });
  }
}

async function changePassword(req, res) {
  const person_id = req.user.id;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Nova senha deve ter ao menos 6 caracteres.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await pool.execute(
      'UPDATE people SET pass = ? WHERE id = ?',
      [hashedPassword, person_id]
    );

    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (err) {
    console.error('Erro ao trocar senha:', err);
    res.status(500).json({ error: 'Erro ao trocar senha' });
  }
}

async function listPeople(req, res) {
  try {
    const [rows] = await pool.execute(`
      SELECT id, name, mail, isTrainee, isAdmin, cooldown_minutes, is_blocked, blocked_reason, max_requests_per_day, max_coffees_per_day
      FROM people
    `);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao listar pessoas:', err);
    res.status(500).json({ error: 'Error listing people' });
  }
}

async function updatePerson(req, res) {
  const { id } = req.params;
  const { name, mail, isTrainee, isAdmin, cooldown_minutes, is_blocked, blocked_reason, max_requests_per_day, max_coffees_per_day } = req.body;

  try {
    await pool.execute(`
      UPDATE people SET
        name = ?, 
        mail = ?, 
        isTrainee = ?, 
        isAdmin = ?, 
        cooldown_minutes = ?, 
        is_blocked = ?, 
        blocked_reason = ?, 
        max_requests_per_day = ?, 
        max_coffees_per_day = ?
      WHERE id = ?
    `, [
      name, mail, isTrainee, isAdmin, cooldown_minutes, is_blocked, blocked_reason, max_requests_per_day, max_coffees_per_day, id
    ]);

    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar pessoa:', err);
    res.status(500).json({ error: 'Error updating person' });
  }
}

module.exports = { createPerson, deletePerson, changePassword, listPeople, updatePerson };
