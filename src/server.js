'use strict';

const app = require('./app');
const config = require('./config/env');
const { connectDB } = require('./config/database');

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
    server.close(() => {
      console.log('[Server] HTTP server closed.');
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
