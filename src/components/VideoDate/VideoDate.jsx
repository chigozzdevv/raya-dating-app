import React, { useState, useEffect, useRef } from 'react';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import { DATING_CONFIG } from '../../utils/config';

const VideoDate = ({ currentUser, matchedUser, onEndCall }) => {
  const [engineInstance, setEngineInstance] = useState(null);
  const [callStatus, setCallStatus] = useState('connecting');
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    startVideoCall();
    return () => {
      endVideoCall();
    };
  }, []);

  const startVideoCall = async () => {
    try {
      setCallStatus('connecting');

      // Create engine instance
      const engine = new ZegoExpressEngine(
        DATING_CONFIG.appID,
        "wss://webliveroom-api.zego.im/ws"
      );

      // Set up event listeners
      engine.on('roomStateUpdate', handleRoomStateUpdate);
      engine.on('roomStreamUpdate', handleStreamUpdate);
      engine.on('publisherStateUpdate', handlePublisherStateUpdate);

      setEngineInstance(engine);

      // Generate unique room ID for this video date
      const roomID = `date_${currentUser.userID}_${matchedUser.userID}_${Date.now()}`;
      
      // Login to room
      await engine.loginRoom(roomID, {
        userID: currentUser.userID,
        userName: currentUser.name
      });

      // Create and publish local stream
      const stream = await engine.createStream({
        camera: {
          audio: true,
          video: true,
          videoQuality: 4 // High quality for dating
        }
      });

      if (localVideoRef.current) {
        stream.play(localVideoRef.current);
      }

      await engine.startPublishingStream(currentUser.userID, stream);
      setLocalStream(stream);
      setCallStatus('connected');

    } catch (error) {
      console.error('Video call failed:', error);
      setCallStatus('error');
    }
  };

  const handleRoomStateUpdate = (roomID, state, errorCode) => {
    if (state === 'CONNECTED') {
      setCallStatus('connected');
    } else if (state === 'DISCONNECTED') {
      setCallStatus('disconnected');
    }
  };

  const handleStreamUpdate = async (roomID, updateType, streamList) => {
    if (updateType === 'ADD' && streamList.length > 0) {
      try {
        // Play remote user's stream
        const remoteStreamObj = await engineInstance.startPlayingStream(
          streamList[0].streamID
        );
        
        if (remoteVideoRef.current) {
          remoteStreamObj.play(remoteVideoRef.current);
        }
        
        setRemoteStream(remoteStreamObj);
        setCallStatus('active');
      } catch (error) {
        console.error('Failed to play remote stream:', error);
      }
    } else if (updateType === 'DELETE') {
      setRemoteStream(null);
      // Other user left, end call after short delay
      setTimeout(() => onEndCall(), 2000);
    }
  };

  const handlePublisherStateUpdate = (result) => {
    if (result.state === 'PUBLISHING') {
      console.log('Successfully publishing stream');
    }
  };

  const toggleMicrophone = async () => {
    if (engineInstance && localStream) {
      try {
        await engineInstance.mutePublishStreamAudio(localStream, !micEnabled);
        setMicEnabled(!micEnabled);
      } catch (error) {
        console.error('Failed to toggle microphone:', error);
      }
    }
  };

  const toggleCamera = async () => {
    if (engineInstance && localStream) {
      try {
        await engineInstance.mutePublishStreamVideo(localStream, !cameraEnabled);
        setCameraEnabled(!cameraEnabled);
      } catch (error) {
        console.error('Failed to toggle camera:', error);
      }
    }
  };

  const endVideoCall = async () => {
    try {
      if (engineInstance) {
        if (localStream) {
          await engineInstance.stopPublishingStream(currentUser.userID);
          engineInstance.destroyStream(localStream);
        }
        if (remoteStream) {
          await engineInstance.stopPlayingStream(remoteStream.streamID);
        }
        await engineInstance.logoutRoom();
        engineInstance.destroyEngine();
      }
      onEndCall();
    } catch (error) {
      console.error('Error ending call:', error);
      onEndCall();
    }
  };

  const getStatusMessage = () => {
    switch (callStatus) {
      case 'connecting':
        return `Connecting to ${matchedUser.name}...`;
      case 'connected':
        return `Waiting for ${matchedUser.name} to join...`;
      case 'active':
        return `Video date with ${matchedUser.name}`;
      case 'error':
        return 'Connection failed';
      case 'disconnected':
        return 'Call ended';
      default:
        return '';
    }
  };

  return (
    <div className="video-date">
      <div className="video-container">
        <div className="remote-video-wrapper">
          <video 
            ref={remoteVideoRef}
            className="remote-video"
            autoPlay
            playsInline
            muted={false}
          />
          {!remoteStream && (
            <div className="video-placeholder">
              <div className="placeholder-avatar">
                <img src={matchedUser.photos[0]} alt={matchedUser.name} />
              </div>
              <div className="status-text">{getStatusMessage()}</div>
            </div>
          )}
        </div>
        
        <div className="local-video-wrapper">
          <video 
            ref={localVideoRef}
            className="local-video"
            autoPlay
            playsInline
            muted={true}
          />
          {!cameraEnabled && (
            <div className="video-off-indicator">Camera Off</div>
          )}
        </div>
      </div>

      <div className="call-controls">
        <button 
          onClick={toggleMicrophone}
          className={`control-button ${micEnabled ? 'active' : 'inactive'}`}
        >
          {micEnabled ? '🎤' : '🔇'}
        </button>
        
        <button 
          onClick={toggleCamera}
          className={`control-button ${cameraEnabled ? 'active' : 'inactive'}`}
        >
          {cameraEnabled ? '📹' : '📵'}
        </button>
        
        <button 
          onClick={endVideoCall}
          className="control-button end-call"
        >
          📞 End Date
        </button>
      </div>

      <div className="call-info">
        <h3>Video Date</h3>
        <p>{getStatusMessage()}</p>
      </div>
    </div>
  );
};

export default VideoDate;