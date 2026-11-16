const express = require('express');
const app = express();

app.use(express.json());

const employeeRoutes = require('./routes/employeeRoutes');
const authRoutes = require('./routes/authenticationRoutes');
const authMiddleware = require('./middleware/authMiddleware');

app.use('/api/auth', authRoutes);
app.use('/api/employees', authMiddleware, employeeRoutes);

module.exports = app;

