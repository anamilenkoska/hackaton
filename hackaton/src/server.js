const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
  console.log("New client connected");

  ws.on('message', (message) => {
    console.log("Broadcasting:", message);
    // Broadcast to all other clients
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client !== ws) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
  });
});

server.listen(3001, () => {
  console.log('WebSocket server running on port 3001');
});
