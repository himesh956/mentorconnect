import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useSocket } from '../context/SocketContext.tsx';
import {
  Sparkles,
  Users,
  Compass,
  Map,
  MessageSquare,
  Video,
  Shield,
  Bell,
  Menu,
  X,
  LogOut,
  ChevronDown,
  GraduationCap,
  CalendarCheck
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { user, logout } = useAuth();
  const { unreadNotifsCount } = useSocket();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const getNavLinks = () => {
    const common = [
      { path: '/mentors', label: 'Find Mentors', icon: Compass },
      { path: '/mentor-ai', label: 'MentorAI Assistant', icon: Sparkles },
    ];

    if (user?.role === 'student') {
      return [
        { path: '/dashboard', label: 'Dashboard', icon: GraduationCap },
        ...common,
        { path: '/roadmap', label: 'Career Roadmap', icon: Map },
        { path: '/sessions', label: 'Sessions', icon: CalendarCheck },
        { path: '/messages', label: 'Messages', icon: MessageSquare },
      ];
    }

    if (user?.role === 'mentor') {
      return [
        { path: '/mentor/dashboard', label: 'Mentor Hub', icon: Users },
        ...common,
        { path: '/sessions', label: 'Sessions', icon: CalendarCheck },
        { path: '/messages', label: 'Messages', icon: MessageSquare },
      ];
    }

    if (user?.role === 'admin') {
      return [
        { path: '/admin', label: 'Analytics Dashboard', icon: Shield },
        { path: '/admin/verification', label: 'Verification Queue', icon: Users },
        { path: '/admin/users', label: 'Manage Users', icon: Users },
        ...common,
      ];
    }

    return common;
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate(user ? (user.role === 'admin' ? '/admin' : user.role === 'mentor' ? '/mentor/dashboard' : '/dashboard') : '/')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-indigo-100" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Mentor Connect <span className="text-indigo-600">AI</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-medium tracking-wide">
                  Rethink 26 • Delhi University
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-colors cursor-pointer"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifsCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-800">Notifications</span>
                        <span className="text-[11px] text-indigo-600 font-medium">All caught up</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="p-2 bg-indigo-50/60 rounded-lg border border-indigo-100/50">
                          <p className="font-semibold text-indigo-900">Session Confirmed!</p>
                          <p className="text-slate-600 text-[11px]">Aditya Sharma accepted your mentorship session tomorrow at 6:00 PM.</p>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <p className="font-semibold text-slate-800">Roadmap Milestone Ready</p>
                          <p className="text-slate-600 text-[11px]">Complete 2 Tree problems to advance Career Readiness score.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div className="hidden sm:block text-left pr-1">
                      <span className="block text-xs font-bold text-slate-800 leading-tight">
                        {user.name}
                      </span>
                      <span className="block text-[10px] text-indigo-600 uppercase font-semibold">
                        {user.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3.5 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-800">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (user.role === 'student') onNavigate('/dashboard');
                          else if (user.role === 'mentor') onNavigate('/mentor/dashboard');
                          else onNavigate('/admin');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                      >
                        Dashboard
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          onNavigate('/');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('/login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => onNavigate('/register')}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-1 animate-in slide-in-from-top duration-150">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate(link.path);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold ${
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
