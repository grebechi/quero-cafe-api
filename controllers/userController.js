const pool = require('../db');

async function getMe(req, res) {
    try {
        const [rows] = await pool.execute('SELECT id, name, isAdmin, isTrainee FROM people WHERE id = ?', [req.user.id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = rows[0];

        res.json({
            id: user.id,
            name: user.name,
            isAdmin: user.isAdmin,
            isTrainee: user.isTrainee
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching user data' });
    }
}

module.exports = { getMe };
