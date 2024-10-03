// server-error-handling.js
function setupErrorHandling(server) {
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection:', reason);
      // Optionally exit the process
    });
  
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      // Optionally exit the process
    });
  
    process.on('SIGTERM', () => {
      server.close(() => {
        console.log('Process terminated');
        // Close database connections, etc.
      });
    });
  }
  
  module.exports = { setupErrorHandling };
  