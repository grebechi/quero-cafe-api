const express = require('express');
const { createRequest, getRequestsByPerson } = require('../controllers/requestController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticate, createRequest);
router.get('/person/:id', authenticate, getRequestsByPerson);

module.exports = router;
