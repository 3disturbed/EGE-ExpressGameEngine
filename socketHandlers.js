// socketHandlers.js
function initializeSocket(io) {
    io.on('connection', (socket) => {
      console.log('New client connected');
  
      // Handle socket events
      socket.on('event-name', (data) => {
        // Handle the event
      });
  
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }
  
  module.exports = { initializeSocket };
  