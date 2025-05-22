require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const peopleRoutes = require('./routes/peopleRoutes');
const requestRoutes = require('./routes/requestRoutes');
const coffeeRoutes = require('./routes/coffeeRoutes');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/people', peopleRoutes);
app.use('/requests', requestRoutes);
app.use('/coffee', coffeeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
