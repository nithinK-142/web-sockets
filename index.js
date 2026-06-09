const http = require('node:http');
const { WebSocketServer } = require('ws')
const fs = require('node:fs/promises')
const path = require('node:path')

const PORT = process.env.PORT ?? 8000;

const httpServer = http.createServer(async (req, res) => {
    const htmlFile = await fs.readFile(path.resolve('./index.html'), 'utf-8')
    res.setHeader('Content-Type', 'text/html')
    return res.end(htmlFile)
})

const wsServer = new WebSocketServer({ server: httpServer })

wsServer.on('connection', (ws) => {
    console.log(ws);
    console.log("websocket connection established")
})

httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})