const GameObject = require('../GameObject');
// This would be sent from the server as a string in 'classData'
class Enemy extends GameObject {
    constructor() {
      super();
      this.x = 200;
      this.y = 200;
      this.isReplicated = false;
    }
  
    OnLoad() {
      console.log('Enemy loaded');
    }
  
    OnDraw(ctx) {
      ctx.fillStyle = 'red';
      ctx.fillRect(this.x, this.y, 50, 50);
    }
  
    OnUpdate() {
      // Example movement logic
      this.x -= 1;
      if(this.x < 0){
        this.x = 800;
      }
      this.serialize();
    


    }
    OnNetworkUpdate(state) {
        this.x = state.position.x;
        this.y = state.position.y;
        // Update other properties
      }
    

  }