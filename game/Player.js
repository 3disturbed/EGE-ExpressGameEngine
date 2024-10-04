
// This would be sent from the server as a string in 'classData'
class Player {
    constructor() {
      this.id = "Player";
      this.x = 100;
      this.y = 100;
      this.isReplicated = true;
    }
    
    OnStart() {}
    OnTick() {}


    OnEnd() {}
    OnClose() {}

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
            this.y = Math.floor(Math.random() *800) - 1;
        }
        // randomize y
        
    }

    OnNetworkUpdate(state) {
        
       
        this.x = state.position.x;
        this.y = state.position.y;
        // Update other properties
      }

    updateFromServer(data) {
      this.isReplicated = data.isReplicated;
      // Update properties based on data.type
      if (data.position) {
        this.x = data.position.x;
        this.y = data.position.y;
      }
    }
    serialize() {
      return [{
        position: { x: this.x, y: this.y }, id: "Player", isReplicated: this.isReplicated, type: this.constructor.name},
        // Include other relevant properties
      ];
    }
    
    
  }
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Player;
  }