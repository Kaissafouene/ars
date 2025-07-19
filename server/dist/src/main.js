"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express = require("express");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
async function bootstrap() {
    const expressApp = express();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp));
    app.enableCors();
    app.setGlobalPrefix('api');
    const httpServer = (0, http_1.createServer)(expressApp);
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        console.log('Socket.io client connected:', socket.id);
        socket.emit('hello', { message: 'Socket.io is working!' });
        socket.on('disconnect', () => {
            console.log('Socket.io client disconnected:', socket.id);
        });
    });
    const port = process.env.PORT ?? 8000;
    await app.init();
    httpServer.listen(port, () => {
        console.log(`Server (with socket.io) running on port ${port}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map