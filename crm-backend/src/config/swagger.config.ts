import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Enterprise CRM API Documentation',
      version: '1.0.0',
      description: 'Production-ready Enterprise CRM API Swagger documentation.',
      contact: {
        name: 'CRM Development Team',
        email: 'dev@crm.local',
      },
    },
    servers: [
      {
        url: 'http://localhost:8000/api',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT accessToken to access protected endpoints.',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Paths to files containing JSDoc documentation comments
  apis: ['./src/**/*.routes.ts', './src/**/*.controller.ts', './src/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
