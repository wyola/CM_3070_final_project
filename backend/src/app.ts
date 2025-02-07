import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { swaggerSpec } from './config/swagger.config';
import organizationRoutes from './routes/organization.routes';

const app: Application = express();

// CORS middleware - allow all origins
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Other middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/organizations', organizationRoutes);

export default app;
