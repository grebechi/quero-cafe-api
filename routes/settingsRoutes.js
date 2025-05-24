const express = require('express');
const { getSetting, updateSetting } = require('../controllers/settingsController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/settings/:key', authenticate, authorizeAdmin, getSetting);
router.put('/settings/:key', authenticate, authorizeAdmin, updateSetting);

module.exports = router;
