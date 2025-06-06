import React, { useState, useEffect } from 'react';
import { DEMO_PROFILES } from '../../utils/config';

const ProfileCard = ({ profile, onSwipe }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev < profile.photos.length - 1 ? prev + 1 : 0
    );
  };

  const handleCardAction = (action) => {
    onSwipe(profile.userID, action);
  };

  return (
    <div className="profile-card">
      <div className="photo-container" onClick={nextPhoto}>
        <img 
          src={profile.photos[currentPhotoIndex]} 
          alt={`${profile.name}'s photo`}
          className="profile-photo"
        />
        <div className="photo-indicators">
          {profile.photos.map((_, index) => (
            <div 
              key={index}
              className={`indicator ${index === currentPhotoIndex ? 'active' : ''}`}
            />
          ))}
        </div>
        {profile.verified && (
          <div className="verification-badge">✓ Verified</div>
        )}
      </div>
      
      <div className="profile-info">
        <div className="name-age">
          <h2>{profile.name}, {profile.age}</h2>
        </div>
        <p className="profession">{profile.profession}</p>
        <p className="location">📍 {profile.location}</p>
        
        <div className="interests">
          {profile.interests.map((interest, index) => (
            <span key={index} className="interest-tag">
              {interest}
            </span>
          ))}
        </div>
      </div>
      
      <div className="action-buttons">
        <button 
          className="pass-button"
          onClick={() => handleCardAction('pass')}
        >
          ✕
        </button>
        <button 
          className="like-button"
          onClick={() => handleCardAction('like')}
        >
          ♥
        </button>
      </div>
    </div>
  );
};

const SwipeInterface = ({ currentUser, onMatch }) => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Filter out current user and load potential matches
    const availableProfiles = DEMO_PROFILES.filter(
      profile => profile.userID !== currentUser.userID
    );
    setProfiles(availableProfiles);
  }, [currentUser]);

  const handleSwipe = (profileID, action) => {
    if (action === 'like') {
      // Simulate match (in real app, this would be server logic)
      const matchedProfile = profiles.find(p => p.userID === profileID);
      onMatch(matchedProfile);
    }
    
    // Move to next profile
    setCurrentIndex(prev => prev + 1);
  };

  if (currentIndex >= profiles.length) {
    return (
      <div className="no-more-profiles">
        <h2>🎯 You're all caught up!</h2>
        <p>Check back later for new potential matches</p>
      </div>
    );
  }

  return (
    <div className="swipe-interface">
      <div className="app-header">
        <h1>💎 RayaClone</h1>
        <div className="user-info">
          Welcome, {currentUser.name}
        </div>
      </div>
      
      <div className="cards-container">
        {profiles.slice(currentIndex, currentIndex + 2).map((profile, index) => (
          <div 
            key={profile.userID}
            className={`card-wrapper ${index === 0 ? 'current' : 'next'}`}
            style={{ zIndex: 2 - index }}
          >
            <ProfileCard profile={profile} onSwipe={handleSwipe} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwipeInterface;