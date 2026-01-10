# Collaborative Puzzle Game - Sample Levels

This folder contains a proof-of-concept for a **text-based collaborative puzzle game** where two players each receive different clues and must communicate to find the answer.

## Game Flow

```
┌─────────────────────────────────────────────┐
│  PRE-GAME: Players chat freely              │
│  (waiting for both to send ≥1 message)      │
├─────────────────────────────────────────────┤
│  STARTING: Show transition dots             │
│            •                                │
│            •                                │
│            •                                │
├─────────────────────────────────────────────┤
│  LEVEL 1: Show level indicator              │
│           Show instructions                 │
│           Show private clue to each player  │
│           Players chat to solve             │
├─────────────────────────────────────────────┤
│  LEVEL COMPLETE: ✓ Correct! Answer: X       │
├─────────────────────────────────────────────┤
│  TRANSITION: Dots animation → Level 2       │
├─────────────────────────────────────────────┤
│  ... repeat for all levels ...              │
├─────────────────────────────────────────────┤
│  GAME COMPLETE: Show end-game stats         │
└─────────────────────────────────────────────┘
```

**Auto-start:** Game begins automatically after both players have sent at least one message.

## Core Mechanics

1. **Asymmetric Information**: Each player sees a different clue
2. **Clue Assignment**: Who gets which clue is randomized each game
3. **Answer Validation**: Case-insensitive substring match (if your message contains "pancake", it counts)
4. **Centered Game Messages**: All game content (clues, instructions, confirmations) is visually distinct from player chat

## The 5 Sample Levels

### Level 1: Compound Words
| Player A | Player B | Answer |
|----------|----------|--------|
| `pan` | `cake` | **pancake** |

Simple word combination. Players share their words and combine them.

---

### Level 2: Split Image (Frog)
| Player A | Player B | Answer |
|----------|----------|--------|
| Vertical 25% slice (full res) | Full image (heavily pixelated) | **frog** |

Player A sees a sharp but partial vertical slice from the middle of the image. Player B sees the whole thing but blurry. They must describe what they see.

**Image source:** [Unsplash - Close-up photography of green frog](https://unsplash.com/photos/close-up-photography-of-green-frog-Rcvf6-n1gc8)

**Dynamic Processing:** The slice and pixelation are generated at runtime using canvas:
- **Slice:** Random vertical 25% slice from the middle 50% of the image
- **Pixelated:** Full image scaled to 20x20 then back to 800x800

This ensures each game session has a different slice position.

---

### Level 3: Math Relay
| Player A | Player B | Answer |
|----------|----------|--------|
| `x + y = 10` | `x − y = 4` | **7** |

A system of equations. Neither can solve alone. The instructions ask: "What is the value of x?"

Solution:
- Add equations: `2x = 14`
- Solve: `x = 7`

---

### Level 4: Coordinates
| Player A | Player B | Answer |
|----------|----------|--------|
| `Latitude: 30.2672° N` | `Longitude: 97.7431° W` | **Austin** |

One player has latitude, the other has longitude. They must combine and look up the city.

(Design note: Cities must be one word—Austin, Chicago, Seattle, Denver, etc.)

---

### Level 5: Document Extraction (Paul Graham Essay)
| Player A | Player B | Answer |
|----------|----------|--------|
| `paulgraham.com/foundermode.html` | `Third paragraph, fifth word` | **talk** |

Player A has a link to a Paul Graham essay. Player B has extraction instructions. A must open the link and count words.

**The text:**
> "The theme of Brian's **talk** was that..."
>   1     2     3   4      5

---

## Typography System

Game messages are styled distinctly from player chat:

```
┌─────────────────────────────────────┐
│           LEVEL 1                   │  ← Level indicator (centered)
├─────────────────────────────────────┤
│  Combine your clues to form a       │  ← Instructions (centered)
│  single word.                       │
├─────────────────────────────────────┤
│         YOUR CLUE                   │  ← Clue (centered, private)
│           pan                       │
├─────────────────────────────────────┤
│  [player messages here]             │  ← Normal chat (left/right)
├─────────────────────────────────────┤
│    ✓ Correct! The answer is         │  ← Answer confirmation
│         pancake                     │
├─────────────────────────────────────┤
│            •                        │  ← Level transition
│            •                        │
│            •                        │
│         Level 2                     │
└─────────────────────────────────────┘
```

See `GameTypography.css` for full styling.

---

## File Structure

```
game/
├── README.md                 # This file
├── index.js                  # Module exports
├── GameMessage.jsx           # React components for game UI
├── GameTypography.css        # Styling for game messages
├── GameState.js              # Game state management
├── imageUtils.js             # Dynamic image processing (slice, pixelate)
├── levels/
│   └── sampleLevels.js       # The 5 sample levels
└── assets/
    └── frog-original.jpg     # Source image (800x800) - processed at runtime
```

---

## Using the Game

```javascript
import {
  GAME_STATES,
  createInitialGameState,
  recordMessage,
  beginLevel,
  advanceToNextLevel,
  getCurrentLevel,
  getClueForPlayer,
  preprocessLevelImages,
  startGameWithProcessedClues,
  generateEndGameStats
} from './game';

// Initialize
let gameState = createInitialGameState();

// Preprocess upcoming levels with images (do this early!)
// This runs in the background while players chat
const level2 = gameState.levels[1]; // Frog level
preprocessLevelImages(level2).then(processedClues => {
  // Store for later use
  cachedLevel2Clues = processedClues;
});

// When a player sends a message
const result = recordMessage(gameState, 'A', message);
gameState = result.gameState;

if (result.shouldStartGame) {
  // Show transition dots, then call beginLevel()
  setTimeout(() => {
    gameState = beginLevel(gameState);
    // Now show level content
  }, 2000);
}

if (result.isCorrect) {
  // Show correct answer, then advance
  setTimeout(() => {
    gameState = advanceToNextLevel(gameState);
  }, 2000);
}

// Get current level and player's clue
const level = getCurrentLevel(gameState);
const clue = getClueForPlayer(gameState, 'A');
```

---

## Next Steps

1. Integrate into the Chat component
2. Sync game state between players via Socket.io
3. Add more levels for each type
4. Playtest with real players
