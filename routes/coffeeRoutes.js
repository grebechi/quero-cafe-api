const express = require('express');
const { createCoffee } = require('../controllers/coffeeController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Registrar café feito - qualquer autenticado
router.post('/', authenticate, createCoffee);

module.exports = router;
