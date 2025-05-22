const express = require('express');
const { createPerson, deletePerson } = require('../controllers/peopleController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Criar usuário - acessível a qualquer autenticado
router.post('/', authenticate, authorizeAdmin, createPerson);

// Deletar usuário - só admin
router.delete('/:id', authenticate, authorizeAdmin, deletePerson);

module.exports = router;
