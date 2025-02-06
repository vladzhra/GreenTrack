const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];  // Récupérer l'en-tête Authorization
    const token = authHeader && authHeader.split(' ')[1];  // Extraire le token après "Bearer"

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Vérification et décodage du token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Stocker les données du token dans req.user
        next();  // Continuer vers la prochaine étape
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticateToken;
