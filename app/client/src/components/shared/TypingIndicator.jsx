import './TypingIndicator.css';

function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <span className="typing-text">Partner is typing</span>
      <span className="typing-dots">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </span>
    </div>
  );
}

export default TypingIndicator;
