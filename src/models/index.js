'use strict';

// Central model registry — import all models here
// so they are registered with Sequelize associations in one place.
const User = require('./user.model');

// Define associations here when you add more models
// e.g. User.hasMany(Post);

module.exports = { User };
