const express = require('express');
const { createRequest, getMyRequests } = require('../controllers/requestController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticate, createRequest);
router.get('/my', authenticate, getMyRequests);

module.exports = router;
