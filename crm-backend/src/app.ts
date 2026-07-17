import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import authRoutes from './auth/auth.routes';

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'CRM API is running',
    timestamp: new Date(),
  });
});

// Register Authentication Routes
app.use('/api/auth', authRoutes);

export default app;