// 简单的 HTTP 服务器用于运行 demo
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
};

const server = createServer(async (req, res) => {
  try {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    // 处理 /dist 路径
    if (filePath.startsWith('/dist/')) {
      filePath = join(__dirname, '..', filePath);
    } else {
      filePath = join(__dirname, filePath);
    }

    const ext = extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';

    const content = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.writeHead(404);
      res.end('404 Not Found');
    } else {
      res.writeHead(500);
      res.end('500 Internal Server Error');
    }
  }
});

server.listen(PORT, () => {
  console.log(`Demo server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop');
});
