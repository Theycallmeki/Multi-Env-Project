import config from "../config/env";
import {  sequelize  } from "../config/database";
import asyncHandler from "../utils/asyncHandler";

/**
 * @desc    Health check endpoint to verify server and database status
 * @route   GET /api/v1/health
 * @access  Public
 */
const getHealth = asyncHandler(async (req, res) => {
  const healthStatus = {
    status: 'ok',
    environment: config.env,
    app: config.app.name,
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: 'disconnected',
    memoryUsage: {}
  };

  try {
    // Check Database connection
    await sequelize.authenticate();
    healthStatus.database = 'connected';
  } catch (error) {
    healthStatus.database = 'disconnected';
    healthStatus.status = 'error';
    healthStatus.error = 'Database connection failed';
  }

  // Get Memory Usage (format in MB)
  const memoryData = process.memoryUsage();
  healthStatus.memoryUsage = {
    rss: `${Math.round(memoryData.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(memoryData.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(memoryData.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(memoryData.external / 1024 / 1024)} MB`,
  };

  // Determine HTTP status code based on health checks
  const httpStatus = healthStatus.status === 'ok' ? 200 : 503;
  
  res.status(httpStatus).json(healthStatus);
});

export {  getHealth  };
