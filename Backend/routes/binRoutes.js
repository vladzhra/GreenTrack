const express = require('express');
const { getBins, addBinData, optimizeRoutes } = require('../controllers/binController');
const router = express.Router();

router.get('/', getBins);
router.post('/', addBinData);
router.get('/optimize', optimizeRoutes);

module.exports = router;
