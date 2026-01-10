/**
 * Sample Levels for Collaborative Puzzle Game
 *
 * Each level contains:
 * - type: The game type
 * - clues: Array of two clues [clueA, clueB] - randomly assigned to players
 * - answer: The correct answer (case-insensitive, substring match)
 * - instructions: Text shown to both players explaining the level type
 */

// Frog source image (served from public/game/assets/)
// Slice and pixelation are generated dynamically at runtime
const FROG_SOURCE = '/game/assets/frog-original.jpg';

export const sampleLevels = [
  // ============================================
  // LEVEL 1: Compound Words
  // ============================================
  {
    id: 'compound-001',
    level: 1,
    type: 'compound_words',
    showInstructions: false,  // Obvious from context
    instructions: 'Combine your clues to form a single word.',
    clues: [
      { type: 'text', value: 'pan' },
      { type: 'text', value: 'cake' }
    ],
    answer: 'pancake',
    acceptedAnswers: ['pancake'],
    hints: ['Something you eat for breakfast']
  },

  // ============================================
  // LEVEL 2: Split Image (Frog)
  // ============================================
  {
    id: 'split-image-001',
    level: 2,
    type: 'split_image',
    showInstructions: false,
    instructions: 'What animal is this?',
    clues: [
      {
        type: 'image',
        sourceImage: FROG_SOURCE,
        processAs: 'slice',
        description: 'A random vertical 25% slice from the middle of the image'
      },
      {
        type: 'image',
        sourceImage: FROG_SOURCE,
        processAs: 'pixelated',
        description: 'The full image, heavily pixelated (scaled to 20x20 then back up)'
      }
    ],
    answer: 'frog',
    acceptedAnswers: ['frog', 'tree frog', 'green frog'],
    hints: ['It\'s a green amphibian']
  },

  // ============================================
  // LEVEL 3: Math Relay
  // ============================================
  {
    id: 'math-001',
    level: 3,
    type: 'math_relay',
    showInstructions: true,  // Need to know to solve for x
    instructions: 'What is the value of x?',
    clues: [
      { type: 'text', value: 'x + y = 10' },
      { type: 'text', value: 'x − y = 4' }
    ],
    answer: '7',
    acceptedAnswers: ['7', 'seven', 'x=7', 'x = 7'],
    hints: ['Try adding the two equations together to eliminate y'],
    solution: 'Adding equations: (x+y) + (x−y) = 10 + 4 → 2x = 14 → x = 7'
  },

  // ============================================
  // LEVEL 4: Coordinates (Austin, TX)
  // ============================================
  {
    id: 'coordinates-001',
    level: 4,
    type: 'coordinates',
    showInstructions: true,  // Need to know it's a city
    instructions: 'What city is this?',
    clues: [
      { type: 'text', value: 'Latitude: 30.2672° N' },
      { type: 'text', value: 'Longitude: 97.7431° W' }
    ],
    answer: 'austin',
    acceptedAnswers: ['austin', 'austin tx', 'austin texas'],
    hints: ['It\'s a major city in Texas', 'Known for SXSW and live music']
  },

  // ============================================
  // LEVEL 5: Essay Lookup (Paul Graham - Founder Mode)
  // ============================================
  {
    id: 'essay-001',
    level: 5,
    type: 'document_extraction',
    showInstructions: false,
    instructions: '',
    clues: [
      {
        type: 'link',
        value: 'https://paulgraham.com/foundermode.html',
        displayText: 'paulgraham.com/foundermode.html'
      },
      {
        type: 'text',
        value: '3rd paragraph, 5th word'
      }
    ],
    answer: 'event',
    acceptedAnswers: ['event'],
    hints: ['The essay is about how founders run companies differently'],
    // Reference: "The audience at this event included..."
    //             1      2      3   4     5
  }
];

/**
 * Get a random assignment of clues to players
 * @param {Object} level - The level object
 * @returns {Object} - { playerA: clue, playerB: clue }
 */
export function assignClues(level) {
  const [clueA, clueB] = level.clues;
  const randomize = Math.random() > 0.5;

  return {
    playerA: randomize ? clueB : clueA,
    playerB: randomize ? clueA : clueB
  };
}

/**
 * Check if an answer is correct
 * @param {string} message - The player's message
 * @param {Object} level - The level object
 * @returns {boolean} - Whether the answer is correct
 */
export function checkAnswer(message, level) {
  const normalizedMessage = message.toLowerCase().trim();

  // Check if any accepted answer appears as a substring
  return level.acceptedAnswers.some(answer =>
    normalizedMessage.includes(answer.toLowerCase())
  );
}

export default sampleLevels;
