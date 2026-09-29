const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { seedDatabaseIfEmpty } = require('./utils/seedData');

// Load environment variablescd 
dotenv.config();
// Connect to MongoDB
connectDB().then(() => {
  // Automatically seed demo data if DB is empty
  seedDatabaseIfEmpty();
});

const app = express();

// Configure CORS for Postman Cloud Agent, mobile apps, and frontend clients
app.use(cors({
  origin: true, // Dynamically allow request origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}));

// Pre-flight requests handler
app.options('*', cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'SmartNotes API Service',
    timestamp: new Date().toISOString(),
    database: 'connected',
    host: req.headers.host || 'unknown',
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Serve compiled frontend production build (allows full website to work from single public URL on any device)
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// For all non-API GET requests, return index.html for React Router SPA
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// 404 & Error Handlers for API
app.use(notFound);
app.use(errorHandler);

const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`[SmartNotes Backend] Server running in ${process.env.NODE_ENV || 'development'} mode on http://${HOST}:${PORT}`);
  console.log(`[SmartNotes Backend] API ready on port ${PORT} listening on ${HOST}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n================================================================`);
    console.error(`[SmartNotes Backend Notice] Port ${PORT} is ALREADY in use.`);
    console.error(`Another instance of the SmartNotes backend is already running on:`);
    console.error(`  http://${HOST}:${PORT}`);
    console.error(`\nAction: Use your existing running backend process.`);
    console.error(`If you wish to force-restart it, run "restart-backend.bat" or "stop-all.bat".`);
    console.error(`================================================================\n`);
    process.exit(0);
  } else {
    console.error('[SmartNotes Backend Fatal Error]:', err);
    process.exit(1);
  }
});
