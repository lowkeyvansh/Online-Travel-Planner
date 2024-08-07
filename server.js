const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost/travel_planner', { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({ username: String, password: String });
const User = mongoose.model('User', UserSchema);

const TripSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    destinations: [String],
    itinerary: [{
        date: Date,
        activities: [String]
    }]
});
const Trip = mongoose.model('Trip', TripSchema);

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
        res.json({ token });
    } else {
        res.status(401).send('Invalid credentials');
    }
});

app.post('/trips', async (req, res) => {
    const { userId } = jwt.verify(req.headers.authorization, 'your_jwt_secret');
    const { destinations, itinerary } = req.body;
    const trip = new Trip({ userId, destinations, itinerary });
    await trip.save();
    res.status(201).send('Trip created');
});

app.get('/trips', async (req, res) => {
    const { userId } = jwt.verify(req.headers.authorization, 'your_jwt_secret');
    const trips = await Trip.find({ userId });
    res.json(trips);
});

// Add more routes for managing trips and itinerary

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
