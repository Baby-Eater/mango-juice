const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Proxy endpoint - fixed version
app.all('/proxy', (req, res) => {
    const targetUrl = req.query.url;
    
    if (!targetUrl) {
        return res.status(400).send('Target URL required');
    }
    
    try {
        new URL(targetUrl);
    } catch (e) {
        return res.status(400).send('Invalid target URL');
    }
    
    const parsedUrl = new URL(targetUrl);
    const target = `${parsedUrl.protocol}//${parsedUrl.host}`;
    const path = parsedUrl.pathname + parsedUrl.search;
    
    // Create proxy middleware
