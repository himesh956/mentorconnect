import React, { useRef, useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PhoneOff,
  MessageSquare,
  ListTodo,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  ShieldCheck,
  Maximize2
} from 'lucide-react';

interface WebRTCCallModalProps {
  onClose: () => void;
}

export const WebRTCCallModal: React.FC<WebRTCCallModalProps> = ({ onClose }) => {
  const { sessionState, endCall, toggleAudio, toggleVideo, toggleScreenShare, socket } = useSocket();
  const { user } = useAuth();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'System', text: 'Encrypted peer-to-peer session connected. Camera, microphone, and screen share active.', time: 'Now' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [actionItems, setActionItems] = useState<string[]>([
    'Solve 2 Tree Traversal problems (LCA & Diameter)',
    'Update Resume bullet points using XYZ format with metrics'
  ]);
  const [newActionItem, setNewActionItem] = useState('');

  // Attach local media stream to video element
  useEffect(() => {
    if (localVideoRef.current && sessionState.localStream) {
      localVideoRef.current.srcObject = sessionState.localStream;
    }
  }, [sessionState.localStream, sessionState.isVideoOff]);

  // Attach remote media stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && sessionState.remoteStream) {
      remoteVideoRef.current.srcObject = sessionState.remoteStream;
    }
  }, [sessionState.remoteStream]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      sender: user?.name || 'You',
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);

    // Send through socket
    if (socket && sessionState.roomId) {
      socket.emit('send-chat-message', {
        conversationId: sessionState.roomId,
        senderId: user?.id,
        senderName: user?.name,
        senderRole: user?.role,
        text: inputMsg.trim()
      });
    }

    setInputMsg('');
  };

  const handleAddActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionItem.trim()) return;
    setActionItems(prev => [...prev, newActionItem.trim()]);
    setNewActionItem('');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!sessionState.inCall) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col overflow-hidden text-white animate-in fade-in duration-200">
      {/* Call Header */}
      <div className="h-14 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold text-slate-100">
              Live Mentorship Session
            </span>
          </div>
          <span className="text-xs text-slate-400">
            • with {sessionState.remoteUserName || 'Mentor Connect Peer'}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-slate-800 text-slate-300">
            {formatDuration(sessionState.callDuration)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>WebRTC P2P Encrypted</span>
          </div>

          <button
            onClick={() => setActiveTab(activeTab === 'chat' ? 'notes' : 'chat')}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {activeTab === 'chat' ? <ListTodo className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
            <span>{activeTab === 'chat' ? 'Action Items' : 'Chat'}</span>
          </button>
        </div>
      </div>

      {/* Main Video Viewports & Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left/Center: Video Area */}
        <div className="flex-1 relative bg-slate-950 flex flex-col items-center justify-center p-4">
          {sessionState.connectionState === 'fallback_audio' && (
            <div className="absolute top-6 left-6 z-20 px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Camera unavailable or permission denied — fallback audio/chat session active</span>
            </div>
          )}

          {/* Remote Video Container */}
          <div className="relative w-full h-full max-h-[75vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-2xl">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Remote user placeholder if no video */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-400 text-xl font-bold shadow-xl mb-3">
                {sessionState.remoteUserName?.charAt(0) || 'M'}
              </div>
              <p className="text-sm font-semibold text-slate-300">
                {sessionState.remoteUserName || 'Mentor'}
              </p>
              <p className="text-xs text-slate-500">
                {sessionState.connectionState === 'connected' ? 'Audio & Video active' : 'Connecting peer stream...'}
              </p>
            </div>

            {/* Local Video Picture-in-Picture */}
            <div className="absolute bottom-4 right-4 w-44 h-32 sm:w-56 sm:h-40 bg-slate-800 rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl z-10">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${sessionState.isVideoOff ? 'hidden' : ''}`}
              />
              {sessionState.isVideoOff && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 text-xs font-medium">
                  <VideoOff className="w-6 h-6 mb-1 text-slate-500" />
                  <span>Camera Off</span>
                </div>
              )}
              <div className="absolute bottom-1.5 left-2 text-[10px] bg-slate-900/80 px-2 py-0.5 rounded-md font-semibold text-slate-300">
                You ({user?.name.split(' ')[0]})
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Chat or Action Items */}
        <div className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col">
          {/* Sidebar Tab Header */}
          <div className="flex border-b border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'chat' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>In-Call Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'notes' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>Post-Session Action Items</span>
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {activeTab === 'chat' ? (
              <div className="space-y-2.5">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-800/80 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-bold text-slate-200">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-indigo-950/40 border border-indigo-900/60 rounded-xl text-xs text-indigo-200 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    Action items assigned here sync automatically to the student's Career Roadmap upon call conclusion.
                  </span>
                </div>

                <div className="space-y-2">
                  {actionItems.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-800 rounded-xl text-xs text-slate-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddActionItem} className="pt-2 flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Assign new action item..."
                    value={newActionItem}
                    onChange={e => setNewActionItem(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* In-Call Chat Input */}
          {activeTab === 'chat' && (
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Type in-session message..."
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Call Footer: Media Controls */}
      <div className="h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-4 px-6">
        {/* Audio Mute Button */}
        <button
          onClick={toggleAudio}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
            sessionState.isMuted
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
          }`}
          title={sessionState.isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {sessionState.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Video Toggle Button */}
        <button
          onClick={toggleVideo}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
            sessionState.isVideoOff
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
          }`}
          title={sessionState.isVideoOff ? 'Start Camera' : 'Stop Camera'}
        >
          {sessionState.isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </button>

        {/* Screen Share Button */}
        <button
          onClick={toggleScreenShare}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
            sessionState.isScreenSharing
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 ring-2 ring-indigo-400'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
          }`}
          title={sessionState.isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
        >
          <Monitor className="w-5 h-5" />
        </button>

        {/* Leave Call Button */}
        <button
          onClick={() => {
            endCall();
            onClose();
          }}
          className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer ml-4"
        >
          <PhoneOff className="w-4 h-4" />
          <span>End Session</span>
        </button>
      </div>
    </div>
  );
};
