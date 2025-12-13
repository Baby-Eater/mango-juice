const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Proxy endpoint - this is the key fix
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
    
    // Create proxy middleware
    const proxy = createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader('X-Forwarded-For', req
