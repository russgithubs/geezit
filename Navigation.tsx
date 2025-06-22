import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle, User, LogOut, Info } from 'lucide-react';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Don't show navigation on welcome, auth, or send message screens
  if (!isAuthenticated || location.pathname === '/' || location.pathname === '/auth' || location.pathname.startsWith('/auth') || (location.pathname !== '/messages' && location.pathname !== '/profile' && location.pathname !== '/about')) {
    return (
      <button 
        onClick={() => navigate('/about')}
        className="fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-gray-700 text-sm font-medium hover:bg-white/30 transition-all duration-300 z-40"
      >
        <Info className="w-4 h-4 inline mr-2" />
        About Us
      </button>
    );
  }

  return (
    <>
      {/* Main Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-5 z-50">
        <button
          onClick={() => navigate('/messages')}
          className={`nav-btn ${location.pathname === '/messages' ? 'shadow-2xl scale-110' : ''}`}
          style={{
            background: 'linear-gradient(45deg, var(--baby-blue), var(--soft-pink))'
          }}
          title="Messages & Hearts"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => navigate('/profile')}
          className={`nav-btn ${location.pathname === '/profile' ? 'shadow-2xl scale-110' : ''}`}
          style={{
            background: 'linear-gradient(45deg, var(--soft-pink), var(--vanilla))'
          }}
          title="Profile Settings"
        >
          <User className="w-6 h-6" />
        </button>
      </div>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="fixed top-5 right-5 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-gray-700 text-sm font-medium hover:bg-white/30 transition-all duration-300 z-40"
      >
        <LogOut className="w-4 h-4 inline mr-2" />
        Logout
      </button>

      {/* About Button */}
      <button 
        onClick={() => navigate('/about')}
        className="fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-gray-700 text-sm font-medium hover:bg-white/30 transition-all duration-300 z-40"
      >
        <Info className="w-4 h-4 inline mr-2" />
        About Us
      </button>
    </>
  );
}