const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Proxy endpoint
app.all('/proxy/*', (req, res) => {
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
    
    const proxy = createProxyMiddleware({
        target: target,
        changeOrigin: true,
        pathRewrite: {
            [`^/proxy/.*`]: path
        },
        onProxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader('X-Forwarded-For', req.connection.remoteAddress);
        },
        onProxyRes: (proxyRes, req, res) => {
            delete proxyRes.headers['access-control-allow-origin'];
            delete proxyRes.headers['content-security-policy'];
        }
    });
    
    proxy(req, res, () => {});
});

// Health check endpoint
app.get('/', (req, res) => {
    res.send(`
        <h1>Proxy Server Running</h1>
        <p>Use /proxy?url=TARGET_URL to access blocked content</p>
    `);
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});