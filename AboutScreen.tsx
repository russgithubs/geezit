import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Shield, Users, Mail } from 'lucide-react';

export default function AboutScreen() {
  const navigate = useNavigate();

  return (
    <div className="card">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-400 font-medium mb-6 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
          GeeziT
        </h1>
        <p className="text-gray-600">About Us</p>
      </div>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-pink-400 mb-4 flex items-center gap-2">
            🌟 Our Story
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              GeeziT was born from a simple idea: everyone deserves a safe space to express their thoughts and feelings without fear of judgment. In a world where social media often feels performative, we created a platform that brings back authentic, heartfelt communication.
            </p>
            <p>
              Founded in 2024, GeeziT has become the go-to platform for millions who want to share compliments, confessions, and genuine thoughts anonymously. We believe that anonymity, when used positively, can foster deeper connections and more honest conversations.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
            💡 Our Mission
          </h2>
          <p className="text-gray-700 leading-relaxed">
            To create a positive, safe environment where people can express themselves freely, spread kindness, and build meaningful connections through anonymous messaging. We're committed to fostering a community built on respect, authenticity, and love.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-pink-400 mb-4">✨ Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-pink-50 p-6 rounded-2xl text-center">
              <MessageCircle className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Anonymous Messages</h3>
              <p className="text-sm text-gray-600">Share your thoughts freely without revealing your identity</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-yellow-50 p-6 rounded-2xl text-center">
              <Heart className="w-12 h-12 text-pink-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Heart System</h3>
              <p className="text-sm text-gray-600">Show appreciation anonymously with our unique heart feature</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-green-50 p-6 rounded-2xl text-center">
              <Shield className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Privacy First</h3>
              <p className="text-sm text-gray-600">Your data is encrypted and your identity is always protected</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-2xl text-center">
              <Users className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Positive Community</h3>
              <p className="text-sm text-gray-600">Built on kindness, respect, and genuine human connection</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
            🛡️ Safety Commitment
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We take safety seriously. Our advanced moderation system and community guidelines ensure that GeeziT remains a positive space for everyone. We have zero tolerance for bullying, harassment, or any form of negativity.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-pink-400 mb-4 flex items-center gap-2">
            <Mail className="w-6 h-6" />
            Contact Us
          </h2>
          <div className="bg-gradient-to-r from-blue-50 to-pink-50 p-6 rounded-2xl">
            <p className="text-gray-700 leading-relaxed">
              Have questions or feedback? We'd love to hear from you!<br />
              <strong>Email:</strong> hello@geezit.app<br />
              <strong>Support:</strong> support@geezit.app
            </p>
          </div>
        </section>

        <div className="text-center p-8 bg-gradient-to-r from-blue-50 via-pink-50 to-yellow-50 rounded-2xl">
          <p className="text-lg font-semibold text-gray-800 mb-2">Made with 💖 by the GeeziT Team</p>
          <p className="text-gray-600">Spreading love, one message at a time</p>
        </div>
      </div>
    </div>
  );
}