import { Server as SocketIOServer, Socket } from 'socket.io';
import { db } from '../db/database.ts';

export function setupSocketIO(io: SocketIOServer) {
  io.on('connection', (socket: Socket) => {
    // console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join personal user room for direct notifications
    socket.on('join-user-room', (userId: string) => {
      if (userId) {
        socket.join(`user_${userId}`);
      }
    });

    // ==========================================
    // 1. WEBRTC SIGNALING
    // ==========================================

    socket.on('join-room', ({ roomId, userId, userName, role }: { roomId: string; userId: string; userName: string; role: string }) => {
      socket.join(roomId);
      // Notify other peer in the room
      socket.to(roomId).emit('user-joined', { socketId: socket.id, userId, userName, role });
      // console.log(`[WebRTC] User ${userName} (${role}) joined room ${roomId}`);
    });

    socket.on('offer', ({ roomId, sdp }: { roomId: string; sdp: any }) => {
      socket.to(roomId).emit('offer', { sdp, senderSocketId: socket.id });
    });

    socket.on('answer', ({ roomId, sdp }: { roomId: string; sdp: any }) => {
      socket.to(roomId).emit('answer', { sdp, senderSocketId: socket.id });
    });

    socket.on('ice-candidate', ({ roomId, candidate }: { roomId: string; candidate: any }) => {
      socket.to(roomId).emit('ice-candidate', { candidate, senderSocketId: socket.id });
    });

    socket.on('screen-share-toggle', ({ roomId, isSharing }: { roomId: string; isSharing: boolean }) => {
      socket.to(roomId).emit('screen-share-toggle', { isSharing, senderSocketId: socket.id });
    });

    socket.on('leave-room', ({ roomId }: { roomId: string }) => {
      socket.leave(roomId);
      socket.to(roomId).emit('user-left', { socketId: socket.id });
    });

    // ==========================================
    // 2. REALTIME CHAT
    // ==========================================

    socket.on('join-chat', ({ conversationId }: { conversationId: string }) => {
      socket.join(`chat_${conversationId}`);
    });

    socket.on('send-chat-message', (data: {
      conversationId: string;
      senderId: string;
      senderName: string;
      senderRole: 'student' | 'mentor' | 'admin';
      text: string;
    }) => {
      const message = db.addMessage({
        id: `msg_${Date.now()}`,
        conversationId: data.conversationId,
        senderId: data.senderId,
        senderName: data.senderName,
        senderRole: data.senderRole,
        text: data.text,
        timestamp: new Date().toISOString(),
        read: false
      });

      // Broadcast to room
      io.to(`chat_${data.conversationId}`).emit('new-chat-message', message);
    });

    socket.on('typing', ({ conversationId, userName }: { conversationId: string; userName: string }) => {
      socket.to(`chat_${conversationId}`).emit('user-typing', { userName });
    });

    socket.on('stop-typing', ({ conversationId }: { conversationId: string }) => {
      socket.to(`chat_${conversationId}`).emit('user-stop-typing');
    });

    socket.on('disconnect', () => {
      // console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
}
