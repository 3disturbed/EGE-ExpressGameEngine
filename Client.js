const GameObject = require('./GameObject');

class Client extends GameObject {
  constructor(socket) {
    super();
    this.socket = socket;
    this.room = null;
    this.username = null;
  }

  joinRoom(roomName) {
    this.room = roomName;
    this.socket.join(roomName);
  }

  leaveRoom() {
    if (this.room) {
      this.socket.leave(this.room);
      this.room = null;
    }
  }

  send(event, data) {
    this.socket.emit(event, data);
  }
}

module.exports = Client;
