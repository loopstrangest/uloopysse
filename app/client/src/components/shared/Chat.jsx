import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import confetti from 'canvas-confetti';
import './Chat.css';

// Game imports
import {
  LevelIndicator,
  Instructions,
  Clue,
  CorrectAnswer,
  LevelTransition,
  GameStats
} from '../../game/GameMessage';
import '../../game/GameTypography.css';
import {
  getLevel,
  getLevelCount,
  getProcessedLevel,
  preloadUpcomingLevels,
  levelNeedsProcessing
} from '../../game/LevelLoader';
import { checkAnswer } from '../../game/levels/levels';

const SOCKET_URL = 'http://localhost:3001';

// Game states
const GAME_STATES = {
  PRE_GAME: 'pre_game',
  STARTING: 'starting',
  PLAYING: 'playing',
  LEVEL_COMPLETE: 'level_complete',
  TRANSITIONING: 'transitioning',
  GAME_COMPLETE: 'game_complete'
};

function Chat({ site }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isPaired, setIsPaired] = useState(false);

  // Game state
  const [gameState, setGameState] = useState(GAME_STATES.PRE_GAME);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [myClue, setMyClue] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [localMessageCount, setLocalMessageCount] = useState(0);
  const [partnerMessageCount, setPartnerMessageCount] = useState(0);
  const [levelStartTime, setLevelStartTime] = useState(null);
  const [gameStats, setGameStats] = useState({
    levelTimes: [],
    firstAnswerPlayer: [],
    myMessages: 0,
    partnerMessages: 0
  });

  // Helper to add game messages to the message flow
  const addGameMessage = (gameMessageType, data = {}) => {
    setMessages(prev => [...prev, {
      type: 'game',
      gameMessageType,
      data,
      timestamp: Date.now()
    }]);
  };

  // Helper to remove transition messages (they're temporary loading indicators)
  const removeTransitionMessages = () => {
    setMessages(prev => prev.filter(msg =>
      !(msg.type === 'game' && msg.gameMessageType === 'transition')
    ));
  };

  // Determine if this is player A or B based on site
  const isPlayerA = site === 'strangestloop';

  // Theme-specific confetti colors
  const getConfettiColors = () => {
    if (site === 'strangestloop') {
      return ['#ffffff', '#e0e0e0', '#c0c0c0', '#a0a0a0', '#f0f0f0'];
    } else {
      return ['#f7454c', '#84739c', '#ff6b6b', '#c44569', '#e84393'];
    }
  };

  // Shoot confetti celebration
  const shootConfetti = () => {
    const colors = getConfettiColors();
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  // Get my clue from a level based on shared swap decision
  // swapClues is generated once and shared between both players
  const getMyClue = (level, swapClues) => {
    const [clueA, clueB] = level.clues;
    if (isPlayerA) {
      return swapClues ? clueB : clueA;
    } else {
      return swapClues ? clueA : clueB;
    }
  };

  const messagesEndRef = useRef(null);
  const gameStateRef = useRef(gameState);
  const currentLevelRef = useRef(currentLevel);
  const currentLevelIndexRef = useRef(currentLevelIndex);

  // Refs for handler functions (to avoid stale closures in socket callbacks)
  const startGameSequenceRef = useRef(null);
  const handleCorrectAnswerRef = useRef(null);
  const advanceToNextLevelRef = useRef(null);
  const gameStatsRef = useRef(gameStats);
  const messagesContainerRef = useRef(null);

  // Helper to update gameState and ref synchronously
  const updateGameState = (newState) => {
    gameStateRef.current = newState;
    setGameState(newState);
  };

  // Keep other refs in sync with state
  useEffect(() => {
    currentLevelRef.current = currentLevel;
  }, [currentLevel]);

  useEffect(() => {
    currentLevelIndexRef.current = currentLevelIndex;
  }, [currentLevelIndex]);

  useEffect(() => {
    gameStatsRef.current = gameStats;
  }, [gameStats]);

  // Global scroll handling - scroll chat from anywhere on page
  useEffect(() => {
    const handleGlobalWheel = (e) => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop += e.deltaY;
      }
    };

    window.addEventListener('wheel', handleGlobalWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleGlobalWheel);
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM has updated before scrolling
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [messages, gameState]);

  // Preload upcoming levels when game starts or level changes
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.PRE_GAME) {
      preloadUpcomingLevels(currentLevelIndex, 2);
    }
  }, [currentLevelIndex, gameState]);

  // Load current level when index changes
  useEffect(() => {
    async function loadLevel() {
      const level = getLevel(currentLevelIndex);
      if (!level) return;

      // Get processed clues if needed
      let clues = level.clues;
      if (levelNeedsProcessing(level)) {
        clues = await getProcessedLevel(currentLevelIndex);
      }

      // Create level with processed clues
      const processedLevel = { ...level, clues };
      setCurrentLevel(processedLevel);
    }

    loadLevel();
  }, [currentLevelIndex]);

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
      setPartnerMessageCount(prev => prev + 1);
    });

    // Game state sync from partner
    newSocket.on('game-state-update', (data) => {
      handlePartnerGameUpdate(data);
    });

    newSocket.on('partner-disconnected', () => {
      setIsPaired(false);
    });

    return () => {
      newSocket.close();
    };
  }, [site]);

  // Handle game state updates from partner (uses refs to avoid stale closures)
  const handlePartnerGameUpdate = useCallback((data) => {
    switch (data.type) {
      case 'start-game':
        // Partner triggered game start
        if (gameStateRef.current === GAME_STATES.PRE_GAME) {
          startGameSequenceRef.current?.(data.swapClues);
        }
        break;

      case 'correct-answer':
        // Partner got the correct answer
        if (gameStateRef.current === GAME_STATES.PLAYING) {
          handleCorrectAnswerRef.current?.(data.answer, 'partner');
        }
        break;

      case 'next-level':
        // Partner advanced to next level
        if (gameStateRef.current === GAME_STATES.LEVEL_COMPLETE) {
          advanceToNextLevelRef.current?.(data.swapClues);
        }
        break;

      case 'game-complete':
        // Partner completed the game, use their shared stats
        if (gameStateRef.current === GAME_STATES.LEVEL_COMPLETE) {
          addGameMessage('game-complete', { stats: data.stats });
          updateGameState(GAME_STATES.GAME_COMPLETE);
          shootConfetti();
        }
        break;
    }
  }, []);

  // Check if game should start (both players sent at least one message)
  // Only playerA initiates to avoid race conditions with clue assignment
  useEffect(() => {
    if (
      isPlayerA &&
      gameState === GAME_STATES.PRE_GAME &&
      localMessageCount >= 1 &&
      partnerMessageCount >= 1 &&
      currentLevel
    ) {
      initiateGameStart();
    }
  }, [localMessageCount, partnerMessageCount, gameState, currentLevel, isPlayerA]);

  // Initiate game start (called by the first player to meet conditions)
  const initiateGameStart = async () => {
    // Generate random swap decision (shared with partner)
    const swapClues = Math.random() > 0.5;

    // Notify partner
    socket?.emit('send-game-update', {
      type: 'start-game',
      swapClues
    });

    // Start locally
    startGameSequence(swapClues);
  };

  // Start game sequence (transition dots → level 1)
  const startGameSequence = (swapClues) => {
    updateGameState(GAME_STATES.STARTING);

    // Add transition dots to chat
    addGameMessage('transition', { nextLevel: 1 });

    // Get my clue based on shared swap decision
    const myAssignedClue = getMyClue(currentLevel, swapClues);
    setMyClue(myAssignedClue);

    // After transition animation (1 second), show level and start playing
    setTimeout(() => {
      removeTransitionMessages();
      addGameMessage('level-start', {
        level: currentLevelIndex + 1,
        instructions: currentLevel?.showInstructions ? currentLevel.instructions : null,
        clue: myAssignedClue
      });
      updateGameState(GAME_STATES.PLAYING);
      setLevelStartTime(Date.now());
      // Scroll to show level info after render
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1000);
  };

  // Handle correct answer
  const handleCorrectAnswer = (answer, answeredBy) => {
    const levelTime = Date.now() - levelStartTime;

    setGameStats(prev => ({
      ...prev,
      levelTimes: [...prev.levelTimes, levelTime],
      firstAnswerPlayer: [...prev.firstAnswerPlayer, answeredBy]
    }));

    // Add correct answer message to chat
    addGameMessage('correct', { answer });
    updateGameState(GAME_STATES.LEVEL_COMPLETE);

    // After showing correct answer, advance (only the answering player initiates)
    setTimeout(() => {
      const nextIndex = currentLevelIndex + 1;

      if (nextIndex >= getLevelCount()) {
        if (answeredBy === 'me') {
          // Calculate and share stats with partner
          const stats = getEndGameStatsDisplay();
          socket?.emit('send-game-update', {
            type: 'game-complete',
            stats
          });
          addGameMessage('game-complete', { stats });
          updateGameState(GAME_STATES.GAME_COMPLETE);
          shootConfetti();
        }
        // If answeredBy === 'partner', wait for 'game-complete' event
      } else if (answeredBy === 'me') {
        // Only the player who answered generates the swap decision and advances
        // Partner will receive 'next-level' event and advance with same swapClues
        const swapClues = Math.random() > 0.5;

        socket?.emit('send-game-update', {
          type: 'next-level',
          swapClues
        });

        advanceToNextLevel(swapClues);
      }
      // If answeredBy === 'partner', wait for 'next-level' event
    }, 2500);
  };

  // Advance to next level
  const advanceToNextLevel = async (swapClues) => {
    updateGameState(GAME_STATES.TRANSITIONING);
    const nextIndex = currentLevelIndex + 1;

    // Add transition to chat
    addGameMessage('transition', { nextLevel: nextIndex + 1 });

    // Load next level
    const nextLevel = getLevel(nextIndex);
    if (!nextLevel) return;

    let clues = nextLevel.clues;
    if (levelNeedsProcessing(nextLevel)) {
      clues = await getProcessedLevel(nextIndex);
    }

    const processedLevel = { ...nextLevel, clues };

    // Get my clue using shared swap decision
    const myAssignedClue = getMyClue(processedLevel, swapClues);

    // After 1 second, remove dots and show level info
    setTimeout(() => {
      removeTransitionMessages();
      setCurrentLevelIndex(nextIndex);
      setCurrentLevel(processedLevel);
      setMyClue(myAssignedClue);

      // Add level start to chat
      addGameMessage('level-start', {
        level: nextIndex + 1,
        instructions: processedLevel?.showInstructions ? processedLevel.instructions : null,
        clue: myAssignedClue
      });

      updateGameState(GAME_STATES.PLAYING);
      setLevelStartTime(Date.now());
      // Scroll to show level info after render
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1000);
  };

  // Keep function refs in sync (for socket callbacks)
  useEffect(() => {
    startGameSequenceRef.current = startGameSequence;
    handleCorrectAnswerRef.current = handleCorrectAnswer;
    advanceToNextLevelRef.current = advanceToNextLevel;
  });

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const sendMessage = () => {
    if (inputValue.trim() && socket && isPaired) {
      const message = inputValue.trim();

      socket.emit('send-message', { message });
      setMessages(prev => [...prev, {
        type: 'sent',
        text: message,
        timestamp: Date.now()
      }]);
      setInputValue('');
      setLocalMessageCount(prev => prev + 1);
      setGameStats(prev => ({ ...prev, myMessages: prev.myMessages + 1 }));

      // Check for correct answer if playing
      if (gameState === GAME_STATES.PLAYING && currentLevel) {
        if (checkAnswer(message, currentLevel)) {
          // Notify partner
          socket.emit('send-game-update', {
            type: 'correct-answer',
            answer: currentLevel.answer
          });

          handleCorrectAnswer(currentLevel.answer, 'me');
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Generate end-game stats display (uses ref to get latest stats)
  const getEndGameStatsDisplay = () => {
    const stats = gameStatsRef.current;
    const totalTime = stats.levelTimes.reduce((a, b) => a + b, 0);
    const myFirstAnswers = stats.firstAnswerPlayer.filter(p => p === 'me').length;
    const partnerFirstAnswers = stats.firstAnswerPlayer.filter(p => p === 'partner').length;

    return [
      { label: 'Total Time', value: formatTime(totalTime) },
      { label: 'Levels Completed', value: getLevelCount() },
      { label: 'Your First Answers', value: myFirstAnswers },
      { label: 'Partner First Answers', value: partnerFirstAnswers },
      { label: 'Your Messages', value: stats.myMessages },
      { label: 'Partner Messages', value: stats.partnerMessages + partnerMessageCount }
    ];
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  };

  // Render a game message inline
  const renderGameMessage = (msg, index) => {
    switch (msg.gameMessageType) {
      case 'transition':
        return (
          <div key={index} className="game-message-wrapper">
            <LevelTransition nextLevel={msg.data.nextLevel} />
          </div>
        );

      case 'level-start':
        return (
          <div key={index} className="game-message-wrapper level-start">
            <div className="game-separator" />
            <LevelIndicator level={msg.data.level} />
            {msg.data.instructions && <Instructions text={msg.data.instructions} />}
            {msg.data.clue && <Clue clue={msg.data.clue} />}
            <div className="game-separator" />
          </div>
        );

      case 'correct':
        return (
          <div key={index} className="game-message-wrapper">
            <CorrectAnswer answer={msg.data.answer} />
          </div>
        );

      case 'game-complete':
        return (
          <div key={index} className="game-message-wrapper">
            <div className="game-separator" />
            <GameStats stats={msg.data.stats} site={site} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`chat-container ${site}`}>
      <div className="messages-container" ref={messagesContainerRef}>
        {/* Chat and game messages interleaved */}
        {messages.filter(msg => msg.type !== 'system').map((msg, index) => {
          if (msg.type === 'game') {
            return renderGameMessage(msg, index);
          }
          return (
            <div key={index} className={`message ${msg.type}`}>
              <span className="message-text">{msg.text}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={isPaired ? "Type a message..." : "Waiting for partner..."}
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
