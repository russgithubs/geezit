import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';
import WelcomeScreen from './components/WelcomeScreen';
import AuthScreen from './components/AuthScreen';
import MessagesScreen from './components/MessagesScreen';
import ProfileScreen from './components/ProfileScreen';
import SendMessageScreen from './components/SendMessageScreen';
import AboutScreen from './components/AboutScreen';
import Navigation from './components/Navigation';
import AlertNotification from './components/AlertNotification';

function App() {
  return (
    <AlertProvider>
      <AuthProvider>
        <div className="min-h-screen">
          <div className="max-w-md mx-auto px-5 py-5 min-h-screen relative">
            <Routes>
              <Route path="/" element={<WelcomeScreen />} />
              <Route path="/auth" element={<AuthScreen />} />
              <Route path="/messages" element={<MessagesScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/about" element={<AboutScreen />} />
              <Route path="/:username" element={<SendMessageScreen />} />
            </Routes>
            <Navigation />
            <AlertNotification />
          </div>
        </div>
      </AuthProvider>
    </AlertProvider>
  );
}

export default App;