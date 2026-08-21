import http from 'http';
import fs from 'fs';
import path from 'path';

const projectRoot = 'C:\\Users\\rougu\\.gemini\\antigravity\\scratch\\contextmuse-homepage';
const PORT = process.env.PORT || 3000;

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
    '.xml': 'application/xml',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    try {
        let reqPath = decodeURIComponent(req.url.split('?')[0]);
        
        // Remove leading slash for path joining
        let relPath = reqPath.replace(/^\//, '');

        let targetPath = path.join(projectRoot, relPath);

        // Check if directory - serve index.html
        if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
            targetPath = path.join(targetPath, 'index.html');
        } else if (!fs.existsSync(targetPath) && !path.extname(targetPath)) {
            // Check with index.html or .html
            if (fs.existsSync(targetPath + '.html')) {
                targetPath = targetPath + '.html';
            } else if (fs.existsSync(path.join(targetPath, 'index.html'))) {
                targetPath = path.join(targetPath, 'index.html');
            }
        }

        if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
            const ext = path.extname(targetPath).toLowerCase();
            res.writeHead(200, {
                'Content-Type': mimeTypes[ext] || 'application/octet-stream',
                'Cache-Control': 'no-cache'
            });
            fs.createReadStream(targetPath).pipe(res);
        } else {
            // 404
            const notFoundPath = path.join(projectRoot, '404.html');
            if (fs.existsSync(notFoundPath)) {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                fs.createReadStream(notFoundPath).pipe(res);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            }
        }
    } catch (e) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error: ' + e.message);
    }
});

server.listen(PORT, () => {
    console.log(`Context & Muse preview server running at http://localhost:${PORT}`);
    console.log(`- Services / Pricing Ladder: http://localhost:${PORT}/services/`);
    console.log(`- Custom Intake: http://localhost:${PORT}/custom/`);
    console.log(`- Systems: http://localhost:${PORT}/systems/`);
    console.log(`- Homepage: http://localhost:${PORT}/`);
});
