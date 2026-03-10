import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { testConnection } from './config/database.js';
import { setupSocketIO } from './services/socketService.js';
import { startSimulator } from './services/simulator.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import deviceRoutes from './routes/deviceRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import sensorRoutes from './routes/sensorRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const httpServer = createServer(app);

// Setup Socket.IO
const io = setupSocketIO(httpServer);
app.set('io', io); // Make io accessible in controllers via req.app.get('io')

// Middleware
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 404 & Error Handling
app.use(notFound);
app.use(errorHandler);

// Start server
async function startServer() {
  const dbConnected = await testConnection();
  if (!dbConnected && env.NODE_ENV === 'production') {
    console.error('Failed to connect to DB. Exiting...');
    process.exit(1);
  }

  httpServer.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
    
    // Start the simulator if DB is connected
    if (dbConnected) {
       startSimulator(io);
    }
  });
}

startServer();
