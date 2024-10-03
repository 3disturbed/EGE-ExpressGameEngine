
// database.js
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

function connectDB() {
  // Replace with your MongoDB connection string
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/EGE-ExpressGameEngine';

  mongoose
    .connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
}

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI ||  'mongodb://localhost:27017/EGE-ExpressGameEngine',
  collectionName: 'sessions',
});

module.exports = connectDB;