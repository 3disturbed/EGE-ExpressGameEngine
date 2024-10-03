// server.js
const { version, port } = require('./server-config');
console.log(`EGE(${version}) - starting server...`);

// Required imports
const http = require('http');
const socketIO = require('socket.io');
const { app } = require('./server-middleware');
const { initializeSocket } = require('./server-sockets');
const { setupErrorHandling } = require('./server-error-handling');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIO(server);

// Setup Socket.IO handlers
initializeSocket(io);

// Setup global error handling
setupErrorHandling(server);

// Start the server
server.listen(port, (err) => {
  if (err) {
    console.error('Server failed to start:', err);
  } else {
    console.log(`Express Game Engine is running on port ${port}`);
  }
});
