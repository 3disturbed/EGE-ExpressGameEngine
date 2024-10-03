# EGE-ExpressGameEngine
Write your game on the server, Client plays as a Viewer. 


Express Game Engine (EGE)
EGE is a game engine built on top of Express.js and Socket.IO. It provides a simple way to create multiplayer games using JavaScript.

Table of Contents
Requirements
Installation
Usage
Project Structure
Dependencies
Security Considerations
License
Requirements
Node.js (version 14.x or higher)
npm (Node Package Manager)
MongoDB (local or remote instance)

Installation
Clone the repository:



npm install compression connect-mongo express express-rate-limit express-session express-socket.io-session helmet mongoose socket.io --save


Set up environment variables:

Create a .env file in the root directory and add the following variables:

env
Copy code
PORT=3300
MONGO_URI=mongodb://localhost:27017/your-db
SESSION_SECRET=your-secret-key
Replace mongodb://localhost:27017/your-db with your actual MongoDB connection string.
Replace your-secret-key with a strong, random string.
Run the server:

bash
Copy code
node server.js
Access the application:

Open your browser and navigate to http://localhost:3300.
