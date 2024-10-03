// server-middleware.js
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const connectDB = require('./database');
const authRoutes = require('./routes/auth');
const { version, sessionSecret } = require('./server-config');

const app = express();

// Connect to MongoDB
connectDB();

console.log(`EGE(${version}) - setting up middleware...`);

// Security middleware
app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'example.com', "'unsafe-eval'"], // Added 'unsafe-eval'
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
    })
  );

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/api/', apiLimiter);

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware configuration
const sessionMiddleware = session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: connectDB.sessionStore, // Use MongoDB session store
  cookie: { secure: false, httpOnly: true }, // Set to true if using HTTPS
});

// Use session middleware in Express
app.use(sessionMiddleware);

// Authentication Routes
app.use('/auth/', authRoutes);

// Serve static files (client-side scripts and HTML)
app.use(
  express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
      res.set('X-Content-Type-Options', 'nosniff');
    },
  })
);

// Protected routes
const router = express.Router();
const { ensureAuthenticated } = require('./middleware/authMiddleware');
router.get('/protected', ensureAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route' });
});
app.use('/api/v1', router); // Prefix with /api or your preferred path

module.exports = { app, sessionMiddleware };
