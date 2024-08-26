const express = require('express');
const cors = require('cors');
const {router, socket_router} = require('./api');
const cron = require("node-cron");
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');

const { initSchedule } = require('./api/services/schedulerService');
const { connect } = require('./api/services/serverService');
const { connect_2 } = require('./api/services/statsService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});
// Middleware
app.use(cors());
app.use(express.json());

connect();
connect_2();
initSchedule();

// API Routes
io.of('api/v1').on('connection', (socket) => {
  console.log('New client connected!')
  //setup routes
  socket_router(socket)

  // On client disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use('/api/v2', router);  
// Start server
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;