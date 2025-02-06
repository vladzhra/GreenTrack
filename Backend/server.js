require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const binRoutes = require('./routes/binRoutes');
const { initModels } = require('./models');
const { swaggerUi, specs } = require('./swagger/swagger');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Configuration de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Initialisation de la base de données
initModels()
    .then(() => console.log('Base de données initialisée'))
    .catch((err) => console.error('Erreur lors de l\'initialisation de la base de données:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bins', binRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
