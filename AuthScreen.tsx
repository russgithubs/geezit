import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function AuthScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const { showAlert } = useAlert();

  const mode = searchParams.get('mode') || 'signup';
  const isLogin = mode === 'login';

  useEffect(() => {
    // Clear form when mode changes
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.length < 3) {
      showAlert('Username must be at least 3 characters', 'error');
      return;
    }
    
    if (password.length < 6) {
      showAlert('Password must be at least 6 characters', 'error');
      return;
    }
    
    if (!isLogin && password !== confirmPassword) {
      showAlert('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      if (isLogin) {
        await login(username, password);
        showAlert('Welcome back! 👋');
      } else {
        await signup(username, password);
        showAlert('Account created successfully! 🎉');
      }
      navigate('/messages');
    } catch (error) {
      showAlert(error instanceof Error ? error.message : 'An error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-blue-400 font-medium mb-6 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
          GeeziT
        </h1>
        <p className="text-gray-600">
          {isLogin ? 'Welcome back!' : 'Create your account'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a unique username"
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a secure password"
              className="form-input pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="form-input"
              required
            />
          </div>
        )}
        
        <button 
          type="submit" 
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              {isLogin ? 'Logging in...' : 'Creating account...'}
            </div>
          ) : (
            isLogin ? 'Log In' : 'Create Account'
          )}
        </button>
        
        <p className="text-center">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button 
            type="button"
            className="text-blue-400 font-medium hover:underline"
            onClick={() => navigate(`/auth?mode=${isLogin ? 'signup' : 'login'}`)}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </form>
    </div>
  );
}