import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { api } from '../services/api';
import { Heart, MessageCircle, ArrowLeft } from 'lucide-react';

export default function SendMessageScreen() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);
  const [isHearted, setIsHearted] = useState(false);
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (username) {
      checkUser();
    }
  }, [username]);

  const checkUser = async () => {
    if (!username) return;
    
    try {
      const response = await api.checkUserExists(username);
      setUserExists(response.exists);
      if (!response.exists) {
        showAlert('User not found', 'error');
        navigate('/');
      }
    } catch (error) {
      showAlert('Error checking user', 'error');
      navigate('/');
    } finally {
      setCheckingUser(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !message.trim()) return;

    setIsLoading(true);
    
    try {
      await api.sendMessage(username, message.trim());
      setMessage('');
      showAlert('Message sent successfully! 🎉');
    } catch (error) {
      showAlert(error instanceof Error ? error.message : 'Failed to send message', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeart = async () => {
    if (!isAuthenticated || !token || !username) {
      showAlert('Create an account to send hearts! 💕');
      navigate('/auth?mode=signup');
      return;
    }

    try {
      const response = await api.sendHeart(token, username);
      setIsHearted(response.hearted);
      createHeartEffect();
      showAlert(response.hearted ? 'Heart sent! 💕' : 'Heart removed 💔');
    } catch (error) {
      showAlert('Failed to send heart', 'error');
    }
  };

  const createHeartEffect = () => {
    const colors = ['❤️', '💕', '💖', '💗', '💓', '💝'];
    
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = colors[Math.floor(Math.random() * colors.length)];
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.bottom = '100px';
        heart.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 3000);
      }, i * 100);
    }
  };

  if (checkingUser) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400"></div>
        </div>
      </div>
    );
  }

  if (!userExists) {
    return null;
  }

  return (
    <>
      <div className="card">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-400 font-medium mb-6 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-pink-400 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
            {username?.[0]?.toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold mb-2">@{username}</h2>
          <p className="text-gray-600">Send an anonymous message</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MessageCircle className="w-4 h-4" />
              Your anonymous message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your anonymous message here..."
              className="form-input min-h-[120px] resize-y"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Sending...
              </div>
            ) : (
              <>
                <MessageCircle className="w-5 h-5 inline mr-2" />
                Send Anonymous Message
              </>
            )}
          </button>
        </form>
        
        <div className="text-center mt-8 p-6 bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl">
          <p className="text-gray-700 mb-4">Want to receive messages too?</p>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/auth?mode=signup')}
          >
            Create Your Profile
          </button>
        </div>
      </div>
      
      {/* Floating Heart Button */}
      <button 
        onClick={handleHeart}
        className={`heart-btn ${isHearted ? 'liked' : ''}`}
        title="Send a heart"
      >
        {isHearted ? '❤️' : '🤍'}
      </button>
    </>
  );
}