const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// Routes d'authentification
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
