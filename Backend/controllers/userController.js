const { User } = require('../models');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
  
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updates = { ...req.body}
        // Vérifiez si le champ password est dans la mise à jour
        if (updates.password) {
            if (updates.password.length < 8) {
                return res.status(400).json({ message: 'Password must be at least 8 characters long' });
            }
            // Hachez le nouveau mot de passe
            updates.password = await bcrypt.hash(updates.password, 10);
        }
  
        // Verifiez si le champ email est dans la mise à jour
        if (updates.email) {
            // Vérifiez si l'email existe déjà
            const existingEmail = await User.findOne({ where: { email: updates.email } });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }
        // Verifiez si le champ username est dans la mise à jour
        if (updates.username) {
            // Vérifiez si l'utilisateur existe déjà
            const existingUser = await User.findOne({ where: { username: updates.username } });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }
        }
        await user.update(updates);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
  
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser
};
