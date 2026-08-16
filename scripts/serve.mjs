import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3000;
const ROOT_DIR = 'C:/Users/rougu/.gemini/antigravity/scratch/contextmuse-homepage';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  if (reqPath.startsWith('/')) reqPath = reqPath.slice(1);

  const filePath = path.join(ROOT_DIR, reqPath);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // Try folder/index.html
    const folderIndex = path.join(filePath, 'index.html');
    if (fs.existsSync(folderIndex) && fs.statSync(folderIndex).isFile()) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(folderIndex).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found: ${req.url}`);
    }
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Context & Muse server running at http://localhost:${PORT}/`);
});
