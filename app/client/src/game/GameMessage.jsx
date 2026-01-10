import React from 'react';
import './GameTypography.css';

/**
 * GameMessage Component
 *
 * Renders game-related messages (not player chat) in a centered,
 * distinct style. Used for:
 * - Level indicators
 * - Instructions
 * - Clues (private to each player)
 * - Correct answer confirmations
 * - Level transitions
 * - End-game stats
 */

// Level indicator: "LEVEL 1"
export function LevelIndicator({ level }) {
  return (
    <div className="game-message game-message--level-indicator">
      LEVEL <span className="level-number">{level}</span>
    </div>
  );
}

// Instructions: explains the game type
export function Instructions({ text }) {
  return (
    <div className="game-message game-message--instructions">
      {text}
    </div>
  );
}

// Clue: the private clue for each player
export function Clue({ clue }) {
  const renderClueContent = () => {
    switch (clue.type) {
      case 'text':
        return <div className="clue-content">{clue.value}</div>;

      case 'image':
        return (
          <img
            className="clue-content clue-content--image"
            src={clue.value}
            alt="Clue"
          />
        );

      case 'link':
        return (
          <a
            className="clue-content clue-content--link"
            href={clue.value}
            target="_blank"
            rel="noopener noreferrer"
          >
            {clue.displayText || clue.value}
          </a>
        );

      default:
        return <div className="clue-content">{clue.value}</div>;
    }
  };

  return (
    <div className="game-message game-message--clue">
      <div className="clue-label">Your Clue</div>
      {renderClueContent()}
    </div>
  );
}

// Correct answer confirmation
export function CorrectAnswer({ answer }) {
  return (
    <div className="game-message game-message--correct">
      <div className="correct-header">✓ Correct!</div>
      <div className="correct-label">The answer is</div>
      <div className="answer-word">{answer}</div>
    </div>
  );
}

// Level transition (dots animation only)
export function LevelTransition() {
  return (
    <div className="game-message game-message--transition">
      <div className="transition-dots">
        <div className="transition-dot" />
        <div className="transition-dot" />
        <div className="transition-dot" />
      </div>
    </div>
  );
}

// End-game stats
export function GameStats({ stats, site }) {
  const isStrangestloop = site === 'strangestloop';

  return (
    <div className="game-message game-message--stats">
      <div className="you-win">You Win!</div>
      <div className="creator-links">
        {isStrangestloop ? (
          <>
            <a href="https://strangestloop.io" target="_blank" rel="noopener noreferrer" className="creator-link strangestloop">
              strangestloop.io
            </a>
            <span className="link-separator">×</span>
            <a href="https://ulyssepence.com" target="_blank" rel="noopener noreferrer" className="creator-link ulyssepence">
              ulyssepence.com
            </a>
          </>
        ) : (
          <>
            <a href="https://ulyssepence.com" target="_blank" rel="noopener noreferrer" className="creator-link ulyssepence">
              ulyssepence.com
            </a>
            <span className="link-separator">×</span>
            <a href="https://strangestloop.io" target="_blank" rel="noopener noreferrer" className="creator-link strangestloop">
              strangestloop.io
            </a>
          </>
        )}
      </div>
      <div className="stats-list">
        {stats.map((stat, index) => (
          <div key={index} className="stat-row">
            <span className="stat-label">{stat.label}:</span>
            <span className="stat-value">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Hint (if players request one)
export function Hint({ text }) {
  return (
    <div className="game-message game-message--hint">
      {text}
    </div>
  );
}

// Error message
export function ErrorMessage({ text }) {
  return (
    <div className="game-message game-message--error">
      {text}
    </div>
  );
}

// Generic game message wrapper
export default function GameMessage({ type, children, ...props }) {
  switch (type) {
    case 'level':
      return <LevelIndicator {...props} />;
    case 'instructions':
      return <Instructions {...props} />;
    case 'clue':
      return <Clue {...props} />;
    case 'correct':
      return <CorrectAnswer {...props} />;
    case 'transition':
      return <LevelTransition {...props} />;
    case 'stats':
      return <GameStats {...props} />;
    case 'hint':
      return <Hint {...props} />;
    case 'error':
      return <ErrorMessage {...props} />;
    default:
      return (
        <div className="game-message">
          {children}
        </div>
      );
  }
}
