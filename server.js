const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the content directly without any UI
app.get('/', async (req, res) => {
    const targetUrl = 'https://read.roadbook.nl/';
    
    try {
        const response = await axios({
            method: 'GET',
            url: targetUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            },
            responseType: 'text',
            timeout: 10000,
            decompress: true,
            validateStatus: () => true
        });
        
        // Set appropriate headers
        res.setHeader('Content-Type', response.headers['content-type'] || 'text/html');
        res.removeHeader('x-frame-options');
        res.removeHeader('content-security-policy');
        
        // Send the content directly
        res.send(response.data);
    } catch (error) {
        res.status(500).send('Error fetching content: ' + error.message);
    }
});

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});
