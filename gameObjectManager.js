const fs = require('fs');
const path = require('path');


// Array to store replicated game objects
// Each object has a name and classData
let replicatedObjects = [];

function readClassFile(fileName) {
  const filePath = path.join(__dirname, 'game', fileName);
  return fs.readFileSync(filePath, 'utf8');
}

function broadcastReplicatedObjects(io) {
    // Collect serialized data of all replicated objects
    const replicatedData = gameObjects
      .filter((obj) => obj.isReplicated)
      .map((obj) => obj.serialize());
  
    // Broadcast to all clients
    io.emit('replicatedObjectUpdate', replicatedData);
  }

function getGameObjectsForClient(sceneName, io) {
  // Load the scene file
  const scenePath = path.join(__dirname, 'scenes', `${sceneName}.js`);
  if (!fs.existsSync(scenePath)) {
    throw new Error(`Scene ${sceneName} does not exist.`);
  }
  const scene = require(scenePath);

  // Read the class files specified in the scene
  const gameObjects = scene.gameObjects.map((fileName) => {
    const classData = readClassFile(fileName);
    const name = path.basename(fileName, '.js'); // Extract class name

    // Check if the object is replicated
    // Instead of parsing the classData, we'll require the class and check the property
    let ClassConstructor;
    try {
      ClassConstructor = require(path.join(__dirname, 'game', fileName));
      console.log(`Loaded ${fileName}`);
    } catch (error) {
      console.error(`Error requiring ${fileName}:`, error);
      throw error; // Re-throw after logging
    }
    // Create an instance to check if it's replicated
    const instance = new ClassConstructor();
    if (instance.isReplicated === true) {
      // Check if the replicatedObjects array already contains this object
      const exists = replicatedObjects.some((obj) => obj.name === name);
      if (!exists) {
        replicatedObjects.push({ name, classData });
      }
    }

    // Return the object with name and classData
    return {
      name,
      classData,
    };
  });

  return gameObjects;
}

module.exports = { getGameObjectsForClient };
