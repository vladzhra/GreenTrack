const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database Connection
const { connectDB } = require('./config/database');
connectDB();

// Routes
const binRoutes = require('./routes/binRoutes');
app.use('/api/bins', binRoutes);

// Error Handling Middleware
// const { errorHandler } = require('./middlewares/errorHandler');
// app.use(errorHandler);

const { swaggerUi, specs } = require('./swagger/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
