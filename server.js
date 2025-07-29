const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const EventEmitter = require('events');

const PORT = process.env.PORT || 3500;
const logEvents = require('./logEvents'); // Make sure this exists or comment it out

class Emitter extends EventEmitter {}
const myEmitter = new Emitter();

// myEmitter.on('log', (msg) => logEvents(msg));

const server = http.createServer(async (req, res) => {
    console.log(req.url, req.method);

    const extension = path.extname(req.url);
    let contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        default:
            contentType = 'text/html';
    }

    let filePath =
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, 'public', req.url);

    // make .html optional
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        try {
            const data = await fsPromises.readFile(filePath, contentType.includes('image') ? null : 'utf8');
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        } catch (err) {
            console.error(err);
            res.writeHead(500);
            res.end('Server Error');
        }
    } else {
        // 404 Not Found
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
        console.log(path.parse(filePath));
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
