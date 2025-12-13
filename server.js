const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Proxy endpoint using axios with fixes
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    
    if (!targetUrl) {
        return res.status(400).send('Target URL required');
    }
    
    try {
        // Validate the target URL
        new URL(targetUrl);
    } catch (e) {
        return res.status(400).send('Invalid target URL');
    }
    
    console.log('Fetching:', targetUrl);
    
    try {
        // Make the request to the target URL
        const response = await axios({
            method: 'GET',
            url: targetUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
                // Note: Removed 'Accept-Encoding' to let axios handle compression automatically
            },
            responseType: 'stream',
            timeout: 10000,
            decompress: true, // Explicitly enable decompression
            validateStatus: () => true // Always proceed regardless of status code
        });
        
        // Set appropriate headers from the target response
        Object.keys(response.headers).forEach(key => {
            // Only pass through safe headers
            if (key.toLowerCase().startsWith('content-') || 
                ['location', 'set-cookie'].includes(key.toLowerCase())) {
                res.setHeader(key, response.headers[key]);
            }
        });
        
        // Send the response stream
        response.data.pipe(res);
        
    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(500).send(`Error fetching content: ${error.message}`);
    }
});

// Health check endpoint
app.get('/', (req, res) => {
    res.send(`
        <h1>Proxy Server Running</h1>
        <p>Use /proxy?url=TARGET_URL to access blocked content</p>
        <p><small>Note: Complex sites with relative paths or heavy JS may not work correctly.</small></p>
    `);
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
