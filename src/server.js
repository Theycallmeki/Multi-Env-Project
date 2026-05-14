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

const trustProxyHops = parseInt(process.env.TRUST_PROXY_HOPS ?? '1', 10);
app.set('trust proxy', trustProxyHops);

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
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

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', routes);

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use(errorMiddleware);

const start = async () => {
  try {
    await connectDB();

    const server = app.listen(config.app.port, () => {
      console.log(`[Server] ${config.app.name} running on ${config.app.port} (${config.env})`);
    });

    const gracefulShutdown = (signal) => {
      server.close(async () => {
        try {
          await sequelize.close();
          process.exit(0);
        } catch (err) {
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason, promise) => {
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (err) => {
      process.exit(1);
    });

  } catch (error) {
    process.exit(1);
  }
};

start();


