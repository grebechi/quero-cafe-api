const pool = require('../db');

// GET /settings/:key
async function getSetting(req, res) {
  const { key } = req.params;

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM settings WHERE key_name = ? LIMIT 1',
      [key]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Configuração não encontrada' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao buscar configuração:', err);
    res.status(500).json({ error: 'Erro ao buscar configuração' });
  }
}

// PUT /settings/:key
async function updateSetting(req, res) {
  const { key } = req.params;
  const { value } = req.body;

  if (typeof value === 'undefined') {
    return res.status(400).json({ error: 'Valor é obrigatório' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM settings WHERE key_name = ? LIMIT 1',
      [key]
    );

    if (rows.length === 0) {
      // Não existe, cria
      await pool.execute(
        'INSERT INTO settings (key_name, value) VALUES (?, ?)',
        [key, value]
      );
      console.log(`Configuração ${key} criada com valor ${value}`);
      return res.status(201).json({ message: 'Configuração criada com sucesso', key, value });
    } else {
      // Existe, atualiza
      await pool.execute(
        'UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key_name = ?',
        [value, key]
      );
      console.log(`Configuração ${key} atualizada para ${value}`);
      return res.json({ message: 'Configuração atualizada com sucesso', key, value });
    }
  } catch (err) {
    console.error('Erro ao atualizar configuração:', err);
    res.status(500).json({ error: 'Erro ao atualizar configuração' });
  }
}

module.exports = { getSetting, updateSetting };
