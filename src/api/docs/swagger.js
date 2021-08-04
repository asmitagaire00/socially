const express = require('express');

const router = express.Router();

const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');

module.exports = router;

const options = {
  explorer: true,
};

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDoc, options));
