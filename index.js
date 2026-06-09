import http from 'node:http';
import { WebSocketServer } from 'ws';
import fs from 'node:fs/promises';
import path from 'node:path';

const PORT = process.env.PORT ?? 8000;

const httpServer = http.createServer(async (req, res) => {
    const htmlFile = await fs.readFile(path.resolve('./index.html'), 'utf-8');
    res.setHeader('Content-Type', 'text/html');
    return res.end(htmlFile);
});

const wsServer = new WebSocketServer({ server: httpServer });

wsServer.on('connection', (ws) => {
    console.log('websocket connection established');
    ws.on('message', (data) => {
        console.log(data.toString());
        ws.send("hello client");
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});