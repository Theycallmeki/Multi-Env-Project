'use strict';

const { Router } = require('express');
const validate = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const { register, login } = require('../controllers/auth.controller');

const router = Router();

router.post('/register', validate(registerSchema), register);

router.post('/login', validate(loginSchema), login);

module.exports = router;
