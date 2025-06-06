import React, { useState } from 'react';
import SwipeInterface from './components/SwipeInterface/SwipeInterface';
import ChatRoom from './components/ChatRoom/ChatRoom';
import VideoDate from './components/VideoDate/VideoDate';
import { DEMO_PROFILES } from './utils/config';
import './App.css';

const LoginScreen = ({ onLogin }) => {
  const [selectedUser, setSelectedUser] = useState('');

  const handleLogin = () => {
    if (selectedUser) {
      const user = DEMO_PROFILES.find(p => p.userID === selectedUser);
      onLogin(user);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        <h1>💎 RayaClone</h1>
        <p>Exclusive dating for verified professionals</p>
        
        <div className="demo-login">
          <h3>Demo Login</h3>
          <p>Choose a profile to experience the app:</p>
          
          <div className="profile-selector">
            {DEMO_PROFILES.map(profile => (
              <div 
                key={profile.userID}
                className={`profile-option ${selectedUser === profile.userID ? 'selected' : ''}`}
                onClick={() => setSelectedUser(profile.userID)}
              >
                <img src={profile.photos[0]} alt={profile.name} />
                <div className="profile-details">
                  <h4>{profile.name}</h4>
                  <p>{profile.profession}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleLogin}
            disabled={!selectedUser}
            className="login-button"
          >
            Enter RayaClone
          </button>
        </div>
      </div>
    </div>
  );
};

const MatchNotification = ({ match, onStartChat, onClose }) => {
  return (
    <div className="match-overlay">
      <div className="match-notification">
        <h2>✨ It's a Match!</h2>
        <div className="matched-users">
          <img src={match.photos[0]} alt={match.name} />
        </div>
        <p>You and {match.name} liked each other</p>
        <div className="match-actions">
          <button onClick={onStartChat} className="start-chat-button">
            💬 Start Conversation
          </button>
          <button onClick={onClose} className="continue-button">
            Keep Swiping
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('login');
  const [activeMatch, setActiveMatch] = useState(null);
  const [showMatchNotification, setShowMatchNotification] = useState(false);
  const [matches, setMatches] = useState([]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentScreen('swipe');
  };

  const handleMatch = (matchedProfile) => {
    setActiveMatch(matchedProfile);
    setMatches(prev => [...prev, matchedProfile]);
    setShowMatchNotification(true);
  };

  const startChatWithMatch = () => {
    setShowMatchNotification(false);
    setCurrentScreen('chat');
  };

  const startVideoDate = () => {
    setCurrentScreen('video');
  };

  const endVideoDate = () => {
    setCurrentScreen('chat');
  };

  const goBackToSwipe = () => {
    setCurrentScreen('swipe');
    setActiveMatch(null);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
        
      case 'swipe':
        return (
          <SwipeInterface 
            currentUser={currentUser}
            onMatch={handleMatch}
          />
        );
        
      case 'chat':
        return (
          <ChatRoom
            currentUser={currentUser}
            matchedUser={activeMatch}
            onVideoCall={startVideoDate}
            onBack={goBackToSwipe}
          />
        );
        
      case 'video':
        return (
          <VideoDate
            currentUser={currentUser}
            matchedUser={activeMatch}
            onEndCall={endVideoDate}
          />
        );
        
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="app">
      {renderCurrentScreen()}
      
      {showMatchNotification && activeMatch && (
        <MatchNotification
          match={activeMatch}
          onStartChat={startChatWithMatch}
          onClose={() => setShowMatchNotification(false)}
        />
      )}
    </div>
  );
}

export default App;