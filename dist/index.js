"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./pre-start"); // Must be the first import
const jet_logger_1 = __importDefault(require("jet-logger"));
const server_1 = __importDefault(require("./server"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const httpServer = http_1.default.createServer(server_1.default);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    },
});
// Constants
const serverStartMsg = 'Express server started on port: ', port = (process.env.PORT || 3000);
// Start server
httpServer.listen(port, () => {
    jet_logger_1.default.info(serverStartMsg + port);
});
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
exports.default = io;
