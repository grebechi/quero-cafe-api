const express = require('express');
const { createCoffee, getCoffeesToday, getLastCoffee, getCoffeesByTrainee } = require('../controllers/coffeeController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticate, createCoffee);
router.get('/today', authenticate, getCoffeesToday);
router.get('/last', authenticate, getLastCoffee);
router.get('/trainee/:id', authenticate, getCoffeesByTrainee);

module.exports = router;
