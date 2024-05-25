const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/patients', async (req, res) => {
    try {
        const response = await fetch(`${process.env.API_URL}`, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.API_USER}:${process.env.API_PASS}`).toString('base64')}`
            }
        });

        if (!response.ok) {
            console.error(`API request failed with status ${response.status}: ${response.statusText}`);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).send('Error fetching patients');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API_USER: ${process.env.API_PASS}`);
    console.log(`API_USER: ${process.env.API_USER}`);

    
});
