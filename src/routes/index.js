'use strict';

const { Router } = require('express');
const config = require('../config/env');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: config.env,
    app: config.app.name,
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

module.exports = router;
