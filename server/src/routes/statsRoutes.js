const express = require('express');
const router = express.express;
// fix express.router -> express.Router()
const routerInstance = express.Router();
const statsController = require('../controllers/statsController');

routerInstance.get('/', statsController.getStats);

module.exports = routerInstance;
