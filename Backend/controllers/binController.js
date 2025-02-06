const { Bin } = require('../models');

// Récupérer toutes les poubelles
const getAllBins = async (req, res) => {
    try {
        const bins = await Bin.findAll();
        res.status(200).json(bins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une poubelle par ID
const getBinById = async (req, res) => {
    try {
        const bin = await Bin.findByPk(req.params.id);
        if (!bin) {
            return res.status(404).json({ message: 'Bin not found' });
        }
        res.status(200).json(bin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer une nouvelle poubelle
const createBin = async (req, res) => {
    try {
        const { name, address, fillLevel, latitude, longitude } = req.body;
        const existingBin = await Bin.findOne({ where: { name } });
        if (existingBin) {
            return res.status(400).json({ message: 'A bin with this name already exists' });
        }
        const newBin = await Bin.create({ name, address, fillLevel, latitude, longitude });
        res.status(201).json(newBin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Mettre à jour une poubelle par ID
const updateBin = async (req, res) => {
    try {
        const bin = await Bin.findByPk(req.params.id);
        if (!bin) {
            return res.status(404).json({ message: 'Bin not found' });
        }
        await bin.update(req.body);
        res.status(200).json(bin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer une poubelle par ID
const deleteBin = async (req, res) => {
    try {
        const bin = await Bin.findByPk(req.params.id);
        if (!bin) {
            return res.status(404).json({ message: 'Bin not found' });
        }
        await bin.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllBins,
    getBinById,
    createBin,
    updateBin,
    deleteBin,
};
