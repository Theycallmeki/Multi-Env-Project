'use strict';

const winston = require('winston');
const config = require('../config/env');

const formats = [
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
];

if (config.isProduction) {
  formats.push(winston.format.json());
} else {
  formats.push(
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} ${level}: ${message}${stack ? `\n${stack}` : ''}`;
    })
  );
}

const logger = winston.createLogger({
  level: config.logging.level || 'info',
  format: winston.format.combine(...formats),
  transports: [
    new winston.transports.Console()
  ]
});

module.exports = logger;
