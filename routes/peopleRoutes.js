const express = require('express');
const { createPerson, deletePerson, changePassword, listPeople, updatePerson } = require('../controllers/peopleController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticate, authorizeAdmin, createPerson);
router.delete('/:id', authenticate, authorizeAdmin, deletePerson);
router.get('/', authenticate, authorizeAdmin, listPeople);
router.put('/:id', authenticate, authorizeAdmin, updatePerson);
router.put('/password', authenticate, changePassword);

module.exports = router;
