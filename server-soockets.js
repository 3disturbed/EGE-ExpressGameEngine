// server-sockets.js
const sharedsession = require('express-socket.io-session');
const { initializeSocket } = require('./socketHandlers');
const { sessionMiddleware } = require('./server-middleware');
const { version } = require('./server-config');

function setupSocketIO(io) {
  console.log(`EGE(${version}) - setting up socket auth...`);

  // Share session between Express and Socket.IO
  io.use(
    sharedsession(sessionMiddleware, {
      autoSave: true,
    })
  );

  // Initialize Socket.IO handlers
  initializeSocket(io);
}

module.exports = { initializeSocket: setupSocketIO };
