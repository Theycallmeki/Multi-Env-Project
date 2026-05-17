import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import compression from "compression";
import cookieParser from "cookie-parser";

import config from "./config/env";
import {  connectDB, sequelize  } from "./config/database";
import routes from "./routes/main.routes";
import errorMiddleware from "./middleware/error.middleware";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import logger from "./utils/logger";

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
app.use(morgan(config.isProduction ? 'combined' : 'dev', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

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
      logger.info(`[Server] ${config.app.name} running on ${config.app.port} (${config.env})`);
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

if (require.main === module) {
  start();
}

export default app;
