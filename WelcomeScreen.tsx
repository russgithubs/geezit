import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Shield, Users } from 'lucide-react';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
          GeeziT
        </h1>
        <p className="text-gray-600">Send anonymous messages & hearts</p>
      </div>
      
      <div className="text-center mb-10">
        <div className="text-8xl mb-6">💌</div>
        <h2 className="text-2xl font-bold mb-4">Share Your Thoughts Anonymously</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Express yourself freely, spread love with hearts, and connect authentically in a safe, positive environment
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-pink-50 p-4 rounded-2xl">
            <MessageCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm font-medium">Anonymous Messages</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-yellow-50 p-4 rounded-2xl">
            <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
            <p className="text-sm font-medium">Send Hearts</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-blue-50 p-4 rounded-2xl">
            <Shield className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm font-medium">Privacy First</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-pink-50 p-4 rounded-2xl">
            <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-sm font-medium">Positive Community</p>
          </div>
        </div>
        
        <button 
          className="btn-primary mb-4"
          onClick={() => navigate('/auth?mode=signup')}
        >
          Create Your Profile
        </button>
        
        <p className="text-center">
          Already have an account?{' '}
          <button 
            className="text-blue-400 font-medium hover:underline"
            onClick={() => navigate('/auth?mode=login')}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}