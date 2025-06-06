import React, { useState, useEffect, useRef } from 'react';
import { ZIM } from 'zego-zim-web';
import { DATING_CONFIG, generateUserToken } from '../../utils/config';

const ChatRoom = ({ currentUser, matchedUser, onVideoCall, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [zimInstance, setZimInstance] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeChat();
    return () => {
      disconnectChat();
    };
  }, [currentUser, matchedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      setConnectionStatus('connecting');
      
      const zim = ZIM.create({ appID: DATING_CONFIG.appID });
      
      // Set up message listeners
      zim.on('peerMessageReceived', handleIncomingMessage);
      zim.on('connectionStateChanged', handleConnectionChange);
      zim.on('error', handleError);

      // Login to ZIM
      const userInfo = {
        userID: currentUser.userID,
        userName: currentUser.name
      };
      
      await zim.login(userInfo, generateUserToken(currentUser.userID));
      
      setZimInstance(zim);
      setConnectionStatus('connected');
      
      // Load initial welcome message
      setMessages([{
        content: `You matched with ${matchedUser.name}! Start the conversation.`,
        timestamp: Date.now(),
        isSystem: true
      }]);
      
    } catch (error) {
      console.error('Chat initialization failed:', error);
      setConnectionStatus('error');
    }
  };

  const handleIncomingMessage = (zim, { messageList, fromConversationID }) => {
    if (fromConversationID === matchedUser.userID) {
      messageList.forEach(message => {
        setMessages(prev => [...prev, {
          content: message.message,
          timestamp: message.timestamp,
          isOwn: false,
          senderName: matchedUser.name
        }]);
      });
    }
  };

  const handleConnectionChange = (zim, { state, event }) => {
    if (state === 1) {
      setConnectionStatus('connected');
    } else if (state === 0) {
      setConnectionStatus('disconnected');
    }
  };

  const handleError = (zim, errorInfo) => {
    console.error('ZIM Error:', errorInfo);
    setConnectionStatus('error');
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !zimInstance) return;

    try {
      const messageObj = {
        type: 1, // Text message
        message: newMessage.trim()
      };

      await zimInstance.sendMessage(
        messageObj,
        matchedUser.userID,
        0, // Peer conversation
        { priority: 1 }
      );

      // Add to local messages
      setMessages(prev => [...prev, {
        content: newMessage.trim(),
        timestamp: Date.now(),
        isOwn: true
      }]);

      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const disconnectChat = async () => {
    if (zimInstance) {
      try {
        await zimInstance.logout();
        zimInstance.destroy();
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <button onClick={onBack} className="back-button">
          ← Back
        </button>
        <div className="match-info">
          <img 
            src={matchedUser.photos[0]} 
            alt={matchedUser.name}
            className="header-avatar"
          />
          <div className="match-details">
            <h3>{matchedUser.name}</h3>
            <span className="status">
              {connectionStatus === 'connected' ? 'Online' : 'Connecting...'}
            </span>
          </div>
        </div>
        <button onClick={onVideoCall} className="video-call-button">
          📹 Video Date
        </button>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.isOwn ? 'own' : ''} ${message.isSystem ? 'system' : ''}`}
          >
            {!message.isOwn && !message.isSystem && (
              <div className="sender-name">{message.senderName}</div>
            )}
            <div className="message-bubble">
              {message.content}
            </div>
            <div className="message-time">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit', 
                minute: '2-digit'
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Message ${matchedUser.name}...`}
          className="message-input"
          maxLength={500}
        />
        <button 
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          className="send-button"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;