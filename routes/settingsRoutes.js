const express = require('express');
const { getSetting, updateSetting, listSettings } = require('../controllers/settingsController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/settings', authenticate, authorizeAdmin, listSettings);
router.get('/settings/:key', authenticate, authorizeAdmin, getSetting);
router.put('/settings/:key', authenticate, authorizeAdmin, updateSetting);

module.exports = router;
