const pool = require('../db');
const bcrypt = require('bcrypt');

async function createPerson(req, res) {
  const { name, mail, pass, isTrainee = false, isAdmin = false } = req.body;

  // Validação básica
  if (!name || !mail || !pass) {
    return res.status(400).json({ error: 'Name, mail e pass são obrigatórios.' });
  }

  try {
    //Verifica se email já existe
    const [existing] = await pool.execute('SELECT id FROM people WHERE mail = ?', [mail]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email já cadastrado.' });
    }

    const hashedPass = await bcrypt.hash(pass, 10);

    await pool.execute(
      'INSERT INTO people (name, mail, pass, isTrainee, isAdmin) VALUES (?, ?, ?, ?, ?)',
      [name, mail, hashedPass, !!isTrainee, !!isAdmin]
    );

    res.status(201).json({ message: 'Usuário criado com sucesso.' });
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    res.status(500).json({ error: 'Erro ao criar usuário.' });
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
  const { 
    name, 
    mail, 
    isTrainee = false, 
    isAdmin = false, 
    cooldown_minutes = null, 
    is_blocked = false, 
    blocked_reason = null, 
    max_requests_per_day = null, 
    max_coffees_per_day = null 
  } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID do usuário é obrigatório.' });
  }

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
      name, 
      mail, 
      !!isTrainee, 
      !!isAdmin, 
      cooldown_minutes, 
      !!is_blocked, 
      blocked_reason, 
      max_requests_per_day, 
      max_coffees_per_day, 
      id
    ]);

    res.json({ message: 'Usuário atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar pessoa:', err);
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
}

module.exports = { createPerson, deletePerson, changePassword, listPeople, updatePerson };
