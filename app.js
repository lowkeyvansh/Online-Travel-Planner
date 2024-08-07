import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

function App() {
    const [trips, setTrips] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

    const fetchTrips = async () => {
        const result = await axios.get(`${API_URL}/trips`, {
            headers: { Authorization: token }
        });
        setTrips(result.data);
    };

    const handleLogin = async () => {
        const result = await axios.post(`${API_URL}/login`, { username, password });
        setToken(result.data.token);
    };

    useEffect(() => {
        if (token) {
            fetchTrips();
        }
    }, [token]);

    return (
        <div>
            <h1>Online Travel Planner</h1>
            {!token ? (
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Login</button>
                </div>
            ) : (
                <div>
                    <h2>My Trips</h2>
                    <ul>
                        {trips.map(trip => (
                            <li key={trip._id}>
                                {trip.destinations.join(', ')}
                                <ul>
                                    {trip.itinerary.map((item, index) => (
                                        <li key={index}>
                                            {new Date(item.date).toDateString()}: {item.activities.join(', ')}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default App;
