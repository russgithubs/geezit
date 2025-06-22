import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { api } from '../services/api';
import { Share2, Copy, MessageCircle, Heart } from 'lucide-react';

interface Message {
  id: number;
  message_text: string;
  created_at: string;
}

interface HeartActivity {
  created_at: string;
}

export default function MessagesScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hearts, setHearts] = useState<HeartActivity[]>([]);
  const [activeTab, setActiveTab] = useState<'messages' | 'activity'>('messages');
  const [isLoading, setIsLoading] = useState(true);
  const { user, token, updateUser } = useAuth();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    if (!token) return;
    
    try {
      const [userProfile, messagesData, heartsData] = await Promise.all([
        api.getUserProfile(token),
        api.getMessages(token),
        api.getHearts(token)
      ]);
      
      updateUser(userProfile);
      setMessages(messagesData);
      setHearts(heartsData);
    } catch (error) {
      showAlert('Failed to load data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyLink = async () => {
    const link = `${window.location.origin}/${user?.username}`;
    try {
      await navigator.clipboard.writeText(link);
      showAlert('Link copied to clipboard! 📋');
    } catch (error) {
      showAlert('Failed to copy link', 'error');
    }
  };

  const shareProfile = async () => {
    const link = `${window.location.origin}/${user?.username}`;
    const text = `Send me anonymous messages on GeeziT! ${link}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Send me anonymous messages!',
          text: text,
          url: link
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      copyLink();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + ' minutes ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + ' hours ago';
    if (diff < 604800000) return Math.floor(diff / 86400000) + ' days ago';
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Profile Header */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-pink-400 flex items-center justify-center text-white text-3xl font-bold mb-4">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.heart_count || 0}
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-1">@{user?.username}</h2>
        <p className="text-gray-600 text-sm">geezit.app/{user?.username}</p>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-8 mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-400">{user?.message_count || 0}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Messages</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-400">{user?.heart_count || 0}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Hearts</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'messages'
              ? 'bg-blue-400 text-white'
              : 'bg-blue-50 text-blue-400 hover:bg-blue-100'
          }`}
        >
          <MessageCircle className="w-4 h-4 inline mr-2" />
          Messages
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'activity'
              ? 'bg-pink-400 text-white'
              : 'bg-pink-50 text-pink-400 hover:bg-pink-100'
          }`}
        >
          <Heart className="w-4 h-4 inline mr-2" />
          Activity
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[200px]">
        {activeTab === 'messages' ? (
          messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No messages yet</p>
              <p className="text-sm text-gray-400">Share your link to start receiving messages!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="message-item">
                  <p className="text-gray-800 mb-2 leading-relaxed">{message.message_text}</p>
                  <p className="text-xs text-gray-500">{formatTime(message.created_at)}</p>
                </div>
              ))}
            </div>
          )
        ) : (
          hearts.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No activity yet</p>
              <p className="text-sm text-gray-400">When someone hearts your profile, you'll see it here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {hearts.map((heart, index) => (
                <div key={index} className="message-item">
                  <p className="text-gray-800 mb-2">Someone hearted your profile 💕</p>
                  <p className="text-xs text-gray-500">{formatTime(heart.created_at)}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Share Section */}
      <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-pink-50 rounded-2xl">
        <p className="text-center text-gray-700 mb-4 font-medium">
          Share your link to receive messages:
        </p>
        <div 
          onClick={copyLink}
          className="bg-white p-4 rounded-xl text-center cursor-pointer hover:bg-gray-50 transition-colors duration-200 mb-4 border-2 border-dashed border-gray-200"
        >
          <p className="text-sm text-gray-600 break-all">
            geezit.app/{user?.username}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={copyLink} className="flex-1 btn-secondary flex items-center justify-center gap-2">
            <Copy className="w-4 h-4" />
            Copy Link
          </button>
          <button onClick={shareProfile} className="flex-1 btn-secondary flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}