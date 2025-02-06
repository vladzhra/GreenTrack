const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Inscription
async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;

        // Vérification si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Utilisateur déjà existant' });
        }

        // Hash du mot de passe
        const passwordHash = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        const newUser = await User.create({ username, email, password_hash: passwordHash });

        res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

// Connexion
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        // Vérification de l'existence de l'utilisateur
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérification du mot de passe
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

        // Génération du token JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Connexion réussie', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

module.exports = {
    registerUser,
    loginUser
};
