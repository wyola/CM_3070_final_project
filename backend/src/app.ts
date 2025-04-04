if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./src/database/sqlite.db';
}

import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { swaggerSpec } from './config/swagger.config';
import organizationRoutes from './routes/organization.routes';
import authRoutes from './routes/auth.routes';
import reportRoutes from './routes/report.routes';
import notificationRoutes from './routes/notification.routes';

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
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

export default app;
