

// Array to store game objects
var GameObjects = [];
  // Initialize Socket.IO but prevent auto-connecting
const socket = io({ autoConnect: false });
// Object to store dynamically loaded classes
const ClassRegistry = {};
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
  
// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  GameObjects.forEach((obj) => {
    obj.OnTick();
    obj.OnUpdate();
    obj.OnDraw(ctx);
  });

  requestAnimationFrame(gameLoop);
}

if (!window.gameLoopStarted) {
  window.gameLoopStarted = true;
  gameLoop();
}

// Function to load class definitions from server data
function loadClassDefinition(data) {
  // Wrap class definition in a function to avoid polluting global scope
  const classDefinition = `
    (function() {
      ${data.classData}
      ClassRegistry['${data.name}'] = ${data.name};
    })();
  `;

  // Evaluate the class definition
  eval(classDefinition);
}

// Socket.IO handlers
socket.on('connect', () => {
  console.log('Connected to server');
  // Send login event
  socket.emit('login', { roomName: 'defaultRoom' });
});

socket.on('initializeGameObjects', (gameObjectsData) => {
  GameObjects.length = 0;

  gameObjectsData.forEach((data) => {
    // Load class definition
    loadClassDefinition(data);

    // Instantiate object if isReplicated is false (local object)
    if (!data.isReplicated) {
      const ClassConstructor = ClassRegistry[data.name];
      if (ClassConstructor) {
        const obj = new ClassConstructor();
        obj.OnLoad();
        GameObjects.push(obj);
      } else {
        console.error(`Class ${data.name} is not defined.`);
      }
    }
  });
});

// Handle replicated object updates
socket.on('replicatedObjectUpdate', (objectsData) => {

      let obj = GameObjects.find((o) => o.id === objectsData.id);
      if (!obj) {
        // Create new object
        const ClassConstructor = ClassRegistry[data.type];
        if (ClassConstructor) {
          obj = new ClassConstructor();
          obj.id = data.id; // Ensure the ID matches
          obj.updateFromServer(data);
          obj.OnLoad();
          GameObjects.push(obj);
        } else {
          console.error(`Class ${data.type} is not defined.`);
          return;
        }
      } else {
        // Update existing object
        obj.updateFromServer(objectsData);
      }

  });


// Handle signup
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
  
    const response = await fetch('/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
  
    const data = await response.json();
    alert(data.message);
  });
  
  // Handle login
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
  
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
  
    const data = await response.json();
    if (response.status === 200) {
      alert(data.message);
      // Proceed to connect Socket.IO
      socket.connect();
    } else {
      alert(data.message);
    }
  });
  
 // Chat system logic
 const chatContainer = document.getElementById('chatContainer');
 const chatHeader = document.getElementById('chatHeader');
 const chatMessages = document.getElementById('chatMessages');
 const chatForm = document.getElementById('chatForm');
 const chatInput = document.getElementById('chatInput');
 const toggleChatButton = document.getElementById('toggleChat');
 
 // Toggle chat visibility
 toggleChatButton.addEventListener('click', () => {
   if (chatContainer.style.display === 'none' || chatContainer.style.display === '') {
     chatContainer.style.display = 'block';
     toggleChatButton.innerText = 'Close Chat';
   } else {
     chatContainer.style.display = 'none';
     toggleChatButton.innerText = 'Open Chat';
   }
 });

 // Toggle chat visibility by clicking the header
 chatHeader.addEventListener('click', () => {
   chatContainer.style.display = chatContainer.style.display === 'block' ? 'none' : 'block';
 });

 // Function to add a message to the chat box
 function addChatMessage(message) {
   const messageElement = document.createElement('div');
   messageElement.textContent = message;
   chatMessages.appendChild(messageElement);
   chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom
 }

 // Handle chat form submission
 chatForm.addEventListener('submit', (event) => {
   event.preventDefault(); // Prevent page reload
   const message = chatInput.value.trim();
   if (message !== '') {
     // Emit chat message to the server
     socket.emit('chatMessage', { message, isGlobal: true }); // Assuming global chat for now
     chatInput.value = ''; // Clear input
   }
 });

 // Listen for incoming chat messages
 socket.on('chatMessage', (messageData) => {
   addChatMessage(messageData.message);
 });

 // Game Loop Logic
 setInterval(() => {
    GameObjects.forEach((obj) => {
      obj.OnTick();
      obj.OnUpdate();
      obj.OnDraw(ctx);

      // send updates to the server for replicated objects
      if (obj.isReplicated) {
        socket.emit('replicatedObjectUpdate', obj.serialize());
      }
    });
  }, 1000 / 60); // 60 times per second