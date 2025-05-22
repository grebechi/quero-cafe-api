const express = require('express');
const { createRequest } = require('../controllers/requestController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Criar uma solicitação de café - qualquer autenticado
router.post('/', authenticate, createRequest);

module.exports = router;
