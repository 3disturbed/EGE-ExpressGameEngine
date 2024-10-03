const GameObject = require('../GameObject');
// This would be sent from the server as a string in 'classData'
class Player extends GameObject {
    constructor() {
      super();
      this.x = 100;
      this.y = 100;
      this.isReplicated = false;
    }
  
    OnLoad() {
      console.log('Player loaded');
    }
  
    OnDraw(ctx) {
      ctx.fillStyle = 'blue';
      ctx.fillRect(this.x, this.y, 50, 50);
    }
  
    OnUpdate() {
      // Example movement logic
      this.x += 1;
        if(this.x > 800){
            this.x = 0;
        }
    }
    OnNetworkUpdate(state) {
        this.x = state.position.x;
        this.y = state.position.y;
        // Update other properties
      }
    
    
  }