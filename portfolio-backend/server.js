require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;
const frontendDir = path.join(__dirname, '..');

app.set('trust proxy', 1);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  : [
      `http://localhost:${PORT}`,
      `http://127.0.0.1:${PORT}`,
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'https://devstudio-bfye.onrender.com'
    ];
const corsOptionsDelegate = (req, callback) => {
  callback(null, {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin === 'null' && process.env.NODE_ENV !== 'production') return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);

      try {
        const requestHost = req.get('host');
        const originHost = new URL(origin).host;

        if (requestHost && originHost === requestHost) {
          return callback(null, true);
        }
      } catch (error) {
        return callback(new Error(`CORS: Origin "${origin}" is not valid.`));
      }

      callback(new Error(`CORS: Origin "${origin}" is not allowed.`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
};

app.use(cors(corsOptionsDelegate));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);
app.use(express.static(frontendDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    database: app.locals.dbConnected ? 'connected' : 'unavailable',
    contactStorage: app.locals.dbConnected ? 'mongodb' : 'local-file',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/contact', contactRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

app.use(errorHandler);

const startServer = async () => {
  const dbConnection = await connectDB();
  app.locals.dbConnected = Boolean(dbConnection);

 const server = app.listen(PORT, () => {
    console.log(`Server running at https://devstudio-bfye.onrender.com/`);
    console.log(`Contact API: POST https://devstudio-bfye.onrender.com/api/contact`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Stop the other backend process or set a different PORT in .env.`);
      process.exit(1);
    }

    throw error;
  });
};

startServer().catch((error) => {
  console.error(`Failed to start server: ${error.message}`);
  process.exit(1);
});
