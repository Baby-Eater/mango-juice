const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve a simple interface
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Content Fetcher</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 50px;
                    background-color: #f0f0f0;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                iframe {
                    width: 100%;
                    height: 600px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Content Fetcher</h1>
                <p>Displaying content from <a href="https://read.roadbook.nl/" target="_blank">https://read.roadbook.nl/</a></p>
                <iframe src="/fetch?url=https://read.roadbook.nl/" frameborder="0"></iframe>
            </div>
        </body>
        </html>
    `);
});

// Fetch endpoint
app.get('/fetch', async (req, res) => {
    const targetUrl = req.query.url || 'https://read.roadbook.nl/';
    
    try {
        const response = await axios({
            method: 'GET',
            url: targetUrl,
            headers
