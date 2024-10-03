'use strict';
class GameObject {
    // This is a parent class for all game objects
    // DO NOT MODIFY THIS CLASS DIRECTLY
    // USE INHERITANCE TO CREATE NEW GAME OBJECTS
    constructor() {
      this.id = this.generateUniqueId();
      this.isReplicated = false;
      this.x = 0;
      this.y = 0;
      this.serialize();
    }
        // Simple utility function to generate a unique ID
        generateUniqueId() {
          return `obj_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
        }
    OnLoad() {}
    OnStart() {}
    OnTick() {}
    OnDraw(ctx) {}
    OnUpdate() {}
    OnEnd() {}
    OnClose() {}
    updateFromServer(data) {
      this.isReplicated = data.isReplicated;
      // Update properties based on data.type
      if (data.position) {
        this.x = data.position.x;
        this.y = data.position.y;
      }
    }
    
    // Serialize object state for replication
    serialize() {
      return {
        id: this.id,
        type: this.constructor.name,
        isReplicated: this.isReplicated,
        x:this.x,
        y:this.y,

        // Include other relevant properties
      };
    }
  }
  
  module.exports = GameObject;