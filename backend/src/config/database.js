'use strict';

const { Sequelize } = require('sequelize');
const config = require('./env');
const logger = require('../utils/logger');

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.pass,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    logging: config.isDevelopment ? (msg) => logger.info(msg) : false,
    pool: {
      max: config.isProduction ? 10 : 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async (retries = 5) => {
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      if (config.isDevelopment) {
        await sequelize.sync({ alter: true });
      }
      return;
    } catch (err) {
      retries -= 1;
      if (retries === 0) {
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

module.exports = { sequelize, connectDB };

