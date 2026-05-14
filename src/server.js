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
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

// ─── Middleware ──────────────────────────────────────────────

// Trust proxy if behind Nginx/Load Balancer
const trustProxyHops = parseInt(process.env.TRUST_PROXY_HOPS ?? '0', 10);
if (trustProxyHops > 0) {
  app.set('trust proxy', trustProxyHops);
}

app.use(helmet());
app.use(cors({
  origin: config.app.url,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
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

// Static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ─── Routes ──────────────────────────────────────────────────

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Error Handler
app.use(errorMiddleware);

// ─── Server Startup ──────────────────────────────────────────

const start = async () => {
  try {
    await connectDB();

    const server = app.listen(config.app.port, () => {
      console.log('─────────────────────────────────────────────');
      console.log(`  🚀 ${config.app.name} is running`);
      console.log(`  🌍 Environment : ${config.env.toUpperCase()}`);
      console.log(`  🔗 URL         : ${config.app.url}`);
      console.log(`  📡 Port        : ${config.app.port}`);
      console.log('─────────────────────────────────────────────');
    });

    const gracefulShutdown = (signal) => {
      console.log(`\n[Server] ${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        console.log('[Server] HTTP server closed.');
        try {
          await sequelize.close();
          console.log('[Server] Database connection closed.');
          process.exit(0);
        } catch (err) {
          console.error('[Server] Error during database shutdown:', err.message);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason, promise) => {
      console.error('[Server] Unhandled Rejection at:', promise, 'reason:', reason);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error('[Server] Failed to start server:', error.message);
    process.exit(1);
  }
};

start();

