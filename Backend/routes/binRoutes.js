const express = require('express');
const { getAllBins, getBinById, createBin, updateBin, deleteBin } = require('../controllers/binController');

const router = express.Router();

// Routes CRUD pour les poubelles
router.get('/', getAllBins);
router.get('/:id', getBinById);
router.post('/', createBin);
router.put('/:id', updateBin);
router.delete('/:id', deleteBin);

module.exports = router;
