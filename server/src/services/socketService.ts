import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyToken } from '../utils/jwt.js';

export function setupSocketIO(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error: No token provided'));

    try {
      const decoded = verifyToken(token);
      socket.data.user = decoded;
      next();
    } catch {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.user.userId;
    console.log(`Socket connected: User ${userId} (${socket.id})`);

    // Join a room specific to this user so we can emit private events to them
    socket.join(userId);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: User ${userId} (${socket.id})`);
    });
  });

  return io;
}
