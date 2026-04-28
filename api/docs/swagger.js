'use strict';

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SIMAJU Core API',
      version: '1.0.0',
      description: 'API Documentation for SIMAJU Core Framework (Enterprise V1)',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      }
    ],
  },
  // Paths to files containing OpenAPI definitions
  apis: ['./api/v1/routes/*.js', './src/modules/*/*.route.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, { explorer: true })
};
