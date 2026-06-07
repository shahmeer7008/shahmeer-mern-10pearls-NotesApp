// Real-time Updates Hook using Socket.IO
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function useRealtimeUpdates(userId: string | undefined) {
  useEffect(() => {
    if (!userId) return;

    // Initialize socket connection
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    
    socket = io(socketUrl, {
      auth: {
        userId,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Connected to real-time server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from real-time server');
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userId]);

  return {
    emitNoteCreated: (note: any) => {
      if (socket) socket.emit('note:created', note);
    },
    emitNoteUpdated: (note: any) => {
      if (socket) socket.emit('note:updated', note);
    },
    emitNoteDeleted: (noteId: string) => {
      if (socket) socket.emit('note:deleted', noteId);
    },
    onNoteCreated: (callback: (note: any) => void) => {
      if (socket) socket.on('note:created', callback);
    },
    onNoteUpdated: (callback: (note: any) => void) => {
      if (socket) socket.on('note:updated', callback);
    },
    onNoteDeleted: (callback: (noteId: string) => void) => {
      if (socket) socket.on('note:deleted', callback);
    },
  };
}

export default useRealtimeUpdates;
