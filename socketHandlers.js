const { getGameObjectsForClient } = require('./gameObjectManager');
const Client = require('./Client');

function initializeSocket(io) {
    io.on('connection', (socket) => {
      const userId = socket.handshake.session.userId;
  
      console.log(`User ${userId} connected via Socket.IO`);
  
      // Check if the user is authenticated
      if (!socket.handshake.session.userId) {
        console.log('Unauthenticated socket connection');
        socket.emit('unauthorized');
        socket.disconnect();
        return;
      }
  
     console.log(`Authenticated client connected: ${socket.handshake.session.username}`);

    const client = new Client(socket);

    // Handle client login
    socket.on('login', (data) => {
      console.log(`Client logged in: ${socket.handshake.session.username}`);
      
      // Example: Assign a room based on data or default
      const roomName = 'main';
      client.joinRoom(roomName);

      // Load the scene for the room
      const sceneName = roomName; // Assuming scene name matches room name
      try {
        const gameObjects = getGameObjectsForClient(sceneName);
        socket.emit('initializeGameObjects', gameObjects);
      } catch (error) {
        console.error(error);
        socket.emit('error', { message: error.message });
      }
    });
    //handle replicated object updates

    socket.on('replicatedObjectUpdate', (objectsData) => {
        objectsData.forEach((data) => {
          let obj = GameObjects.find((o) => o.id === data.id);
          if (!obj) {
            // Create new object
            const ClassConstructor = ClassRegistry[data.type];
            if (ClassConstructor) {
              obj = new ClassConstructor();
              obj.updateFromServer(data);
              obj.OnLoad();
              GameObjects.push(obj);
            } else {
              console.error(`Class ${data.type} is not defined.`);
              return;
            }
          } else {
            // Update existing object
            obj.updateFromServer(data);
          }
        });
      });

      

    // Handle chat messages
    socket.on('chatMessage', (messageData) => {
        console.log(`Message received: ${messageData.message}`);
        messageData.message = `${socket.handshake.session.username}: ${messageData.message}`;
      if (messageData.isGlobal) {
        // Send to all clients
        io.emit('chatMessage', messageData);
      } else {
        // Send to clients in the same room
        socket.to(client.room).emit('chatMessage', messageData);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User ${socket.handshake.session.username} disconnected`);
      });
  });
}

module.exports = { initializeSocket };

  module.exports = { initializeSocket };
  