const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./logsEvents');
const EventEmitter = require('events');
class Emitter extends EventEmitter { };
// initialize object 
const myEmitter = new Emitter();
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));
const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf8' : ''
        );
        const data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            { 'Content-Type': contentType }
        );
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch (err) {
        console.log(err);
        myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt');
        response.statusCode = 500;
        response.end();
    }
}

const { spin, checkWin } = require('./GameLogic');

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');

    // Handle API Route
    if (req.url === '/api/spin' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const { balance, bet, lines } = JSON.parse(body);
                const rows = spin();
                const winnings = checkWin(rows, lines, bet);
                const newBalance = balance - (bet * lines) + winnings;

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ rows, winnings, newBalance }));
            } catch (err) {
                myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt');
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid request body' }));
            }
        });

        return; // exit here so the rest of the file serving logic doesn't run
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));