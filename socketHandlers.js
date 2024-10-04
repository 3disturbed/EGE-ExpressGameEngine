const { getGameObjectsForClient } = require('./gameObjectManager');
const Client = require('./Client');
var gameObjects = [];
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
        gameObjects = getGameObjectsForClient(sceneName, io);
        console.log(`Sending game objects to client: ${gameObjects.length}`);
        for (let i = 0; i < gameObjects.length; i++) {
          console.log(gameObjects[i].name);
        }
        socket.emit('initializeGameObjects', gameObjects);
      } catch (error) {
        console.error(error);
        socket.emit('error', { message: error.message });
      }
    });
    //handle replicated object updates

    socket.on('replicatedObjectUpdate', (objectsData) => {
     
        if (!objectsData) {
          console.error('No object data received.');
          return;
        } 
        
        objectsData.forEach((data) => {
          let obj = gameObjects.find((o) => o.id === data.id);
          if (!obj) {
            // load class definition form ./game folder
            const ClassConstructor = require(`./game/${data.id}`);
            obj = new ClassConstructor();
            gameObjects.push(obj);
            console.log(`Creating new object: ${data.type}`);
          } else {
            // Update existing object
            obj.updateFromServer(data);
            // send to all clients
            io.emit('replicatedObjectUpdate', data);
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