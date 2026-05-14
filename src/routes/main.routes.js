'use strict';

const { Router } = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const { getHealth } = require('../controllers/health.controller');

const router = Router();

// Health Check
router.get('/health', getHealth);

// API Modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

module.exports = router;

