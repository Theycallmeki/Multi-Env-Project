'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const config = require('./config/env');
const { connectDB, sequelize } = require('./config/database');
const routes = require('./routes/main.routes');
const errorMiddleware = require('./middleware/error.middleware');

// ─── Express App Setup ───────────────────────────────────────

const app = express();

const trustProxyHops = parseInt(process.env.TRUST_PROXY_HOPS ?? '0', 10);
if (trustProxyHops > 0) {
  app.set('trust proxy', trustProxyHops);
}

app.use(helmet());
app.use(cors({
  origin: config.app.url,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests. Please try again later.' },
}));

app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan(config.isProduction ? 'combined' : 'dev'));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/v1', routes);

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorMiddleware);

// ─── Server Bootstrap ────────────────────────────────────────

const start = async () => {
  await connectDB();

  const server = app.listen(config.app.port, () => {
    console.log('─────────────────────────────────────────────');
    console.log(`    ${config.app.name}`);
    console.log(`    Environment : ${config.env.toUpperCase()}`);
    console.log(`    Server      : ${config.app.url}`);
    console.log(`    Port        : ${config.app.port}`);
    console.log('─────────────────────────────────────────────');
  });

  const shutdown = (signal) => {
    console.log(`\n[Server] ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      console.log('[Server] HTTP server closed.');
      try {
        await sequelize.close();
        console.log('[Server] Database connection closed.');
      } catch (err) {
        console.error('[Server] Error closing database connection:', err.message);
      }
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (err) => {
    console.error('[Server] Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });
};

start();
