const express = require('express');
const { getAllUsers, getUserById, deleteUser, updateUser } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Route protégée
router.get('/', getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);

module.exports = router;
