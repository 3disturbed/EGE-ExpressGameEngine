module.exports = {
    name: 'main',
    gameObjects: ['Player.js', 'Enemy.js'], // List of game object files

    
  };

  // In your scene or game manager
const NPC = require('./game/NPC');

// Array to hold all game objects, including NPCs
let gameObjects = [];

// Function to initialize the scene
function initializeScene() {
  // Create NPCs
  for (let i = 0; i < 5; i++) {
    const npc = new NPC();
    gameObjects.push(npc);
  }
  // Initialize other game objects...
}

// Function to update all game objects
function updateGameObjects() {
  gameObjects.forEach((obj) => {
    if (typeof obj.update === 'function') {
      obj.update();
    }
  });
}

// Call initializeScene when starting the server or loading the scene
initializeScene();

// Set up the game loop
setInterval(() => {
  updateGameObjects();
  broadcastReplicatedObjects();
}, 1000 / 30); // 30 updates per second