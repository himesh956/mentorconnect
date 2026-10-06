import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext.tsx';

interface WebRTCSessionState {
  inCall: boolean;
  roomId: string | null;
  remoteUserName: string | null;
  connectionState: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'fallback_audio';
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  callDuration: number;
}

interface SocketContextType {
  socket: Socket | null;
  sessionState: WebRTCSessionState;
  startCall: (roomId: string, targetName: string) => Promise<void>;
  endCall: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => Promise<void>;
  unreadNotifsCount: number;
  triggerRefreshNotifs: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(2);

  const [sessionState, setSessionState] = useState<WebRTCSessionState>({
    inCall: false,
    roomId: null,
    remoteUserName: null,
    connectionState: 'idle',
    isMuted: false,
    isVideoOff: false,
    isScreenSharing: false,
    localStream: null,
    remoteStream: null,
    callDuration: 0,
  });

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const timerRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const s = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    s.on('connect', () => {
      // console.log('[Socket] Connected to server');
      if (user) {
        s.emit('join-user-room', user.id);
      }
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [user?.id]);

  // Handle WebRTC call timer
  useEffect(() => {
    if (sessionState.inCall) {
      timerRef.current = setInterval(() => {
        setSessionState(prev => ({ ...prev, callDuration: prev.callDuration + 1 }));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionState.inCall]);

  // Setup PeerConnection signaling listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('user-joined', async () => {
      // Create Offer if peer joins
      if (peerConnectionRef.current) {
        try {
          const offer = await peerConnectionRef.current.createOffer();
          await peerConnectionRef.current.setLocalDescription(offer);
          socket.emit('offer', { roomId: sessionState.roomId, sdp: offer });
        } catch (err) {
          console.warn('[WebRTC] Error creating offer:', err);
        }
      }
    });

    socket.on('offer', async ({ sdp }: { sdp: RTCSessionDescriptionInit }) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socket.emit('answer', { roomId: sessionState.roomId, sdp: answer });
        } catch (err) {
          console.warn('[WebRTC] Error handling offer:', err);
        }
      }
    });

    socket.on('answer', async ({ sdp }: { sdp: RTCSessionDescriptionInit }) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
          setSessionState(prev => ({ ...prev, connectionState: 'connected' }));
        } catch (err) {
          console.warn('[WebRTC] Error handling answer:', err);
        }
      }
    });

    socket.on('ice-candidate', async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      if (peerConnectionRef.current && candidate) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.warn('[WebRTC] Error adding ICE candidate:', err);
        }
      }
    });

    socket.on('user-left', () => {
      setSessionState(prev => ({ ...prev, connectionState: 'disconnected' }));
    });

    return () => {
      socket.off('user-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('user-left');
    };
  }, [socket, sessionState.roomId]);

  // Start WebRTC Call
  const startCall = async (roomId: string, targetName: string) => {
    setSessionState(prev => ({
      ...prev,
      inCall: true,
      roomId,
      remoteUserName: targetName,
      connectionState: 'connecting',
      callDuration: 0,
    }));

    let mediaStream: MediaStream | null = null;

    try {
      // Attempt camera & microphone
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
    } catch (err) {
      console.warn('[WebRTC] Camera access denied or unavailable, checking audio fallback:', err);
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setSessionState(prev => ({ ...prev, connectionState: 'fallback_audio' }));
      } catch (audioErr) {
        console.warn('[WebRTC] Audio access also restricted. Creating synthetic canvas stream for demo resilience.');
        // Create synthetic video canvas stream so video element doesn't crash during live presentation!
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(0, 0, 640, 480);
          ctx.fillStyle = '#38bdf8';
          ctx.font = '24px sans-serif';
          ctx.fillText('Mentor Connect AI Video Stream', 140, 240);
        }
        mediaStream = (canvas as any).captureStream ? (canvas as any).captureStream(15) : new MediaStream();
        setSessionState(prev => ({ ...prev, connectionState: 'fallback_audio' }));
      }
    }

    localStreamRef.current = mediaStream;

    // Initialize RTCPeerConnection
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    // Add local tracks to peer connection
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => {
        pc.addTrack(track, mediaStream!);
      });
    }

    // Handle remote track
    const remoteStream = new MediaStream();
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
      setSessionState(prev => ({
        ...prev,
        remoteStream,
        connectionState: 'connected',
      }));
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', { roomId, candidate: event.candidate });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setSessionState(prev => ({ ...prev, connectionState: 'connected' }));
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setSessionState(prev => ({ ...prev, connectionState: 'disconnected' }));
      }
    };

    // Join room
    if (socket && user) {
      socket.emit('join-room', {
        roomId,
        userId: user.id,
        userName: user.name,
        role: user.role,
      });
    }

    setSessionState(prev => ({
      ...prev,
      localStream: mediaStream,
      remoteStream,
    }));
  };

  const endCall = () => {
    if (socket && sessionState.roomId) {
      socket.emit('leave-room', { roomId: sessionState.roomId });
    }

    // Stop local streams
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(t => t.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setSessionState({
      inCall: false,
      roomId: null,
      remoteUserName: null,
      connectionState: 'idle',
      isMuted: false,
      isVideoOff: false,
      isScreenSharing: false,
      localStream: null,
      remoteStream: null,
      callDuration: 0,
    });
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setSessionState(prev => ({ ...prev, isMuted: !audioTrack.enabled }));
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setSessionState(prev => ({ ...prev, isVideoOff: !videoTrack.enabled }));
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!sessionState.isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];

        // Replace track on peer connection
        if (peerConnectionRef.current) {
          const senders = peerConnectionRef.current.getSenders();
          const videoSender = senders.find(s => s.track && s.track.kind === 'video');
          if (videoSender) {
            videoSender.replaceTrack(screenTrack);
          }
        }

        screenTrack.onended = () => {
          stopScreenSharing();
        };

        if (socket && sessionState.roomId) {
          socket.emit('screen-share-toggle', { roomId: sessionState.roomId, isSharing: true });
        }

        setSessionState(prev => ({ ...prev, isScreenSharing: true }));
      } catch (err) {
        console.warn('[WebRTC] Screen sharing cancelled or denied:', err);
      }
    } else {
      stopScreenSharing();
    }
  };

  const stopScreenSharing = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(t => t.stop());
      screenStreamRef.current = null;
    }

    // Restore camera track
    if (localStreamRef.current && peerConnectionRef.current) {
      const cameraTrack = localStreamRef.current.getVideoTracks()[0];
      const senders = peerConnectionRef.current.getSenders();
      const videoSender = senders.find(s => s.track && s.track.kind === 'video');
      if (videoSender && cameraTrack) {
        videoSender.replaceTrack(cameraTrack);
      }
    }

    if (socket && sessionState.roomId) {
      socket.emit('screen-share-toggle', { roomId: sessionState.roomId, isSharing: false });
    }

    setSessionState(prev => ({ ...prev, isScreenSharing: false }));
  };

  const triggerRefreshNotifs = () => {
    setUnreadNotifsCount(prev => Math.max(0, prev - 1));
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        sessionState,
        startCall,
        endCall,
        toggleAudio,
        toggleVideo,
        toggleScreenShare,
        unreadNotifsCount,
        triggerRefreshNotifs,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
