const http = require('http');

const PORT = process.env.PORT ?? 8000;

const httpServer = http.createServer()

httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})