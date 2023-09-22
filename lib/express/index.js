const express = require("express");
const http = require('http');
const socketIo = require('socket.io');
const ioClient = require('socket.io-client');


const routing = express();
const port = process.env.express_routing_port;
routing.use(express.json());
const server = routing.listen(port, () => {
    console.log(`Load API at http://localhost:${port}`);
});



//const server = http.createServer(routing);
const io = socketIo(server);


module.exports = { routing, io, ioClient };
