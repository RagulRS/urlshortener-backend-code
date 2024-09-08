const express = require('express');
const { register, activateAccount, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.get('/activate/:id', activateAccount);
router.post('/login', login);

module.exports = router;
