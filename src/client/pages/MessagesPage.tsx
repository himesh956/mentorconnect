import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useSocket } from '../context/SocketContext.tsx';
import { api } from '../api/apiClient.ts';
import { Conversation, ChatMessage } from '../../types/index.ts';
import {
  Send,
  MessageSquare,
  User,
  Clock,
  Sparkles,
  CheckCheck
} from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    api.getConversations().then(res => {
      setConversations(res.conversations || []);
      if (res.conversations && res.conversations.length > 0) {
        setActiveConv(res.conversations[0]);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConv) {
      api.getMessages(activeConv.id).then(res => {
        setMessages(res.messages || []);
      });

      if (socket) {
        socket.emit('join-chat', { conversationId: activeConv.id });
      }
    }
  }, [activeConv?.id]);

  // Listen for realtime chat messages from Socket.IO
  useEffect(() => {
    if (!socket) return;

    socket.on('new-chat-message', (msg: ChatMessage) => {
      if (activeConv && msg.conversationId === activeConv.id) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => {
      socket.off('new-chat-message');
    };
  }, [socket, activeConv?.id]);

  // Scroll to bottom of message thread
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeConv) return;

    const text = inputMsg.trim();
    setInputMsg('');

    try {
      const res = await api.sendMessage({
        conversationId: activeConv.id,
        text
      });

      // Send through socket for instant delivery
      if (socket) {
        socket.emit('send-chat-message', {
          conversationId: activeConv.id,
          senderId: user?.id,
          senderName: user?.name,
          senderRole: user?.role,
          text
        });
      } else {
        setMessages(prev => [...prev, res.message]);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-4">
        <div className="h-20 bg-slate-200/70 rounded-3xl"></div>
        <div className="h-96 bg-slate-200/70 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Direct Messages
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Real-time Socket.IO chat with your mentors and mentees.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden h-[620px] flex">
        {/* Left: Conversation List */}
        <div className="w-80 border-r border-slate-200/80 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200/80 font-bold text-xs text-slate-700 uppercase tracking-wider">
            Conversations
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map(conv => {
              const isSelected = activeConv?.id === conv.id;
              const otherName = user?.role === 'student' ? conv.mentorName : conv.studentName;

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConv(conv)}
                  className={`w-full p-4 text-left transition-colors cursor-pointer flex items-start gap-3 ${
                    isSelected ? 'bg-white border-l-4 border-indigo-600 shadow-2xs' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0">
                    {otherName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {otherName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {conv.lastMessage || 'Start conversation...'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Message Thread */}
        <div className="flex-1 flex flex-col bg-white">
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {(user?.role === 'student' ? activeConv.mentorName : activeConv.studentName).charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">
                      {user?.role === 'student' ? activeConv.mentorName : activeConv.studentName}
                    </h3>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Real-time Socket.IO Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages Viewport */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-slate-50/30">
                {messages.map(msg => {
                  const isMe = msg.senderId === user?.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-xs'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-3.5 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputMsg}
                  onChange={e => setInputMsg(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
                <button
                  type="submit"
                  disabled={!inputMsg.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 opacity-40" />
              <p className="text-xs">Select a conversation from the left to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
