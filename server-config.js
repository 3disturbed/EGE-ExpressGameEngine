// server-config.js
module.exports = {
    version: '0.0.1',
    port: process.env.PORT || 3300,
    sessionSecret: process.env.SESSION_SECRET || 'your-secret-key', // Use an environment variable in production
  };
  