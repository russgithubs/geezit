import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { api } from '../services/api';
import { ArrowLeft, User, Mail, Calendar } from 'lucide-react';

export default function ProfileScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) return;

    const updates: { username?: string; email?: string } = {};
    if (username !== user?.username) updates.username = username;
    if (email !== (user?.email || '')) updates.email = email;

    if (Object.keys(updates).length === 0) {
      showAlert('No changes to save', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const updatedUser = await api.updateProfile(token, updates);
      updateUser(updatedUser);
      showAlert('Profile updated successfully! ✨');
    } catch (error) {
      showAlert(error instanceof Error ? error.message : 'Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <button 
        onClick={() => navigate('/messages')}
        className="flex items-center gap-2 text-blue-400 font-medium mb-6 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Messages
      </button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
          Profile Settings
        </h1>
        <p className="text-gray-600">Manage your account</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4" />
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4" />
            Email (optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="form-input"
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
              Saving...
            </div>
          ) : (
            'Save Changes'
          )}
        </button>
      </form>
      
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
          <Calendar className="w-5 h-5" />
          Account Information
        </h3>
        <p className="text-gray-600">
          Member since: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Loading...'}
        </p>
      </div>
    </div>
  );
}