import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import TypingIndicator from './TypingIndicator';
import './Chat.css';

const SOCKET_URL = 'http://localhost:3001';

function Chat({ site }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isPaired, setIsPaired] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join-room', { site });
    });

    newSocket.on('disconnect', () => {
      setIsPaired(false);
    });

    newSocket.on('paired', () => {
      setIsPaired(true);
    });

    newSocket.on('receive-message', ({ message, from, timestamp }) => {
      setMessages(prev => [...prev, {
        type: 'received',
        text: message,
        from,
        timestamp
      }]);
      setPartnerTyping(false);
    });

    newSocket.on('partner-typing', () => {
      setPartnerTyping(true);
    });

    newSocket.on('partner-stopped-typing', () => {
      setPartnerTyping(false);
    });

    newSocket.on('partner-disconnected', () => {
      setIsPaired(false);
    });

    return () => {
      newSocket.close();
    };
  }, [site]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);

    if (socket && isPaired) {
      socket.emit('typing');

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop-typing');
      }, 1000);
    }
  };

  const sendMessage = () => {
    if (inputValue.trim() && socket && isPaired) {
      socket.emit('send-message', { message: inputValue.trim() });
      setMessages(prev => [...prev, {
        type: 'sent',
        text: inputValue.trim(),
        timestamp: Date.now()
      }]);
      setInputValue('');
      socket.emit('stop-typing');

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`chat-container ${site}`}>
      <div className="messages-container">
        {messages.filter(msg => msg.type !== 'system').map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <span className="message-text">{msg.text}</span>
          </div>
        ))}
        {partnerTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={!isPaired}
          rows={1}
        />
        <button
          onClick={sendMessage}
          disabled={!isPaired || !inputValue.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
