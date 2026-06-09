import http from 'node:http';
import { WebSocketServer } from 'ws';
import fs from 'node:fs/promises';
import path from 'node:path';
import { redisPublisher, redisSubscriber } from './redis.js';

const PORT = process.env.PORT ?? 8000;
const REDIS_CHANNEL = 'ws-channel';

const httpServer = http.createServer(async (req, res) => {
    const htmlFile = await fs.readFile(path.resolve('./index.html'), 'utf-8');
    res.setHeader('Content-Type', 'text/html');
    return res.end(htmlFile);
});

const wsServer = new WebSocketServer({ server: httpServer });

await redisSubscriber.subscribe(REDIS_CHANNEL);
redisSubscriber.on('message', (channel, data) => {
    wsServer.clients.forEach(client => {
        if (channel !== REDIS_CHANNEL) return
        const parsedData = JSON.parse(data.toString());
        client.send(JSON.stringify({ message: parsedData.message }))
    })
})

wsServer.on('connection', (ws) => {
    console.log('websocket connection established');
    console.log('Current clients', wsServer.clients.size);
    ws.on('message', async (data) => {
        const parsedData = JSON.parse(data.toString());
        await redisPublisher.publish(REDIS_CHANNEL, JSON.stringify({ message: parsedData.message }))
    });
    ws.on('close', () => {
        console.log('Client disconnected');
        console.log('Current clients', wsServer.clients.size);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});