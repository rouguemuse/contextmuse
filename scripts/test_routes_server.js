import http from 'http';
import fs from 'fs';
import path from 'path';

const projectRoot = 'C:\\Users\\rougu\\.gemini\\antigravity\\scratch\\contextmuse-homepage';

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png'
};

const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath.endsWith('/')) reqPath += 'index.html';
    else if (!path.extname(reqPath)) reqPath += '/index.html';

    const filePath = path.join(projectRoot, reqPath);
    if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
        res.end(fs.readFileSync(filePath));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(3333, async () => {
    console.log('Test server running at http://localhost:3333');

    const testUrls = [
        '/',
        '/websites/',
        '/audit/',
        '/work/',
        '/services/',
        '/about/',
        '/start/',
        '/systems/',
        '/signal/',
        '/gensort/',
        '/cartography/',
        '/restaurant-systems/',
        '/privacy/',
        '/terms/'
    ];

    let allPass = true;
    for (const urlPath of testUrls) {
        await new Promise((resolve) => {
            http.get(`http://localhost:3333${urlPath}`, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        const hasH1 = data.includes('<h1');
                        const hasNav = data.includes('<nav class="navbar"');
                        console.log(`[PASS] ${urlPath} -> 200 OK (h1: ${hasH1}, nav: ${hasNav})`);
                    } else {
                        console.error(`[FAIL] ${urlPath} -> Status ${res.statusCode}`);
                        allPass = false;
                    }
                    resolve();
                });
            }).on('error', (err) => {
                console.error(`[FAIL] ${urlPath} -> ${err.message}`);
                allPass = false;
                resolve();
            });
        });
    }

    server.close(() => {
        console.log(`\nRoute Server Test Result: ${allPass ? 'ALL PASSED' : 'SOME FAILED'}`);
        process.exit(allPass ? 0 : 1);
    });
});
