const GameObject = require('../GameObject');

class NPC extends GameObject {
  constructor() {
    super();
    this.isReplicated = true; // Ensure this NPC is replicated to clients
    this.x = Math.random() * 800; // Random starting position
    this.y = Math.random() * 600;
    this.speedX = (Math.random() - 0.5) * 2; // Random speed
    this.speedY = (Math.random() - 0.5) * 2;
  }

  // Update NPC position
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Boundary checks
    if (this.x < 0 || this.x > 800) this.speedX *= -1;
    if (this.y < 0 || this.y > 600) this.speedY *= -1;
  }

  // Serialize object state for replication
  serialize() {
    return {
      id: this.id,
      type: this.constructor.name,
      isReplicated: this.isReplicated,
      position: { x: this.x, y: this.y },
    };
  }
}

module.exports = NPC;
