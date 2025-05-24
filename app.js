require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const peopleRoutes = require('./routes/peopleRoutes');
const requestRoutes = require('./routes/requestRoutes');
const coffeeRoutes = require('./routes/coffeeRoutes');
const userRoutes = require('./routes/userRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const docsRoute = require('./routes/docsRoutes');


const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false   
}));
app.use(express.json());
app.options('*', cors());

app.use('/auth', authRoutes);
app.use('/people', peopleRoutes);
app.use('/requests', requestRoutes);
app.use('/coffee', coffeeRoutes);
app.use('/user', userRoutes);
app.use('/', docsRoute);
app.use('/api', settingsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
