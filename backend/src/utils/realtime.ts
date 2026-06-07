import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
let io: SocketServer | null = null;

export function registerRealtimeServer(server: HttpServer) {
  io = new SocketServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token || typeof token !== 'string') {
      return next(new Error('Authentication required'));
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET) as { sub?: string };
      if (!payload.sub) {
        return next(new Error('Invalid token'));
      }

      socket.data.userId = payload.sub;
      return next();
    } catch (err) {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId as string;
    socket.join(`user:${userId}`);
    logger.info({ type: 'SOCKET_CONNECTED', userId, socketId: socket.id });

    socket.on('disconnect', () => {
      logger.info({ type: 'SOCKET_DISCONNECTED', userId, socketId: socket.id });
    });
  });

  return io;
}

export function broadcastNoteChange(userId: string, event: string, payload: unknown) {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
}
