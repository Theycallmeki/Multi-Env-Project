'use strict';

const { Sequelize } = require('sequelize');
const config = require('./env');

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.pass,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    logging: config.isDevelopment ? console.log : false,
    pool: {
      max: config.isProduction ? 10 : 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`[DB] Connected to "${config.db.name}" on ${config.db.host} (${config.env})`);
    if (config.isDevelopment) {
      await sequelize.sync({ alter: true });
      console.log('[DB] Models synced (development)');
    }
  } catch (err) {
    console.error('[DB] Connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
