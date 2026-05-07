'use strict';

const { Router } = require('express');
const { register, login } = require('../controllers/auth.controller');

const router = Router();

// POST /api/v1/auth/register
router.post('/register', register);

// POST /api/v1/auth/login
router.post('/login', login);

module.exports = router;
