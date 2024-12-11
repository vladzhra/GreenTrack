const Bin = require('../models/binModel');
const { calculateOptimizedRoutes } = require('../utils/routeOptimization');

const getBins = async (req, res) => {
    try {
        const bins = await Bin.findAll();
        res.json(bins);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const addBinData = async (req, res) => {
    const { id, fillLevel, location } = req.body;

    try {
        const bin = await Bin.create({ id, fillLevel, location });
        res.status(201).json(bin);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add bin data' });
    }
};

const optimizeRoutes = (req, res) => {
    try {
        const optimizedRoutes = calculateOptimizedRoutes();
        res.json(optimizedRoutes);
    } catch (error) {
        res.status(500).json({ message: 'Failed to optimize routes' });
    }
};

module.exports = { getBins, addBinData, optimizeRoutes };
