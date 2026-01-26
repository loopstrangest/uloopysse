/**
 * Levels for Collaborative Puzzle Game
 *
 * Structure: 15 levels across 5 level types, 3 difficulty tiers each
 * - Levels 1/6/11: Word Puzzles (compound words / word association / word bridge)
 * - Levels 2/7/12: Split Image (animals / food / vehicles)
 * - Levels 3/8/13: Math Relay (simple / coefficients / elimination)
 * - Levels 4/9/14: Coordinates (cities / landmarks / natural sites)
 * - Levels 5/10/15: Text Puzzles (doc extraction / essay extraction / anagrams)
 */

// ============================================
// LEVEL TYPE CONFIGURATIONS
// ============================================

const LEVEL_TYPES = {
  compound_words: {
    showInstructions: false,
    instructions: "Combine your clues to form a single word.",
  },
  word_association: {
    showInstructions: false,
    instructions: "What word do both clues point to?",
  },
  word_bridge: {
    showInstructions: true,
    instructions: "What is the bridge?",
  },
  split_image: {
    showInstructions: false,
    instructions: "What is this?",
  },
  math_relay: {
    showInstructions: true,
    instructions: "What is the value of x?",
  },
  coordinates: {
    showInstructions: true,
    instructions: "What city is this?",
  },
  document_extraction: {
    showInstructions: false,
    instructions: "",
  },
  anagram: {
    showInstructions: true,
    instructions: "What word completes the anagram?",
  },
};

// ============================================
// FACTORY FUNCTIONS
// ============================================

function textClue(value) {
  return { type: "text", value };
}

function linkClue(url, displayText) {
  return { type: "link", value: url, displayText };
}

function imageClue(sourceImage, processAs) {
  const descriptions = {
    slice: "A random vertical 25% slice from the middle",
    pixelated: "The full image, heavily pixelated",
  };
  return {
    type: "image",
    sourceImage,
    processAs,
    description: descriptions[processAs],
  };
}

function createLevel(
  type,
  id,
  clues,
  answer,
  acceptedAnswers,
  hints = [],
  extra = {},
) {
  const config = LEVEL_TYPES[type];
  return {
    id,
    type,
    showInstructions: config.showInstructions,
    instructions: config.instructions,
    clues,
    answer,
    acceptedAnswers,
    hints,
    ...extra,
  };
}

function createSplitImageLevel(
  difficulty,
  imageKey,
  answer,
  acceptedAnswers,
  category,
) {
  const image = `/game/assets/${imageKey}.jpg`;
  return createLevel(
    "split_image",
    `split-${difficulty}-${imageKey}`,
    [imageClue(image, "slice"), imageClue(image, "pixelated")],
    answer,
    acceptedAnswers,
    [],
    { instructions: `What ${category} is this?` },
  );
}

// ============================================
// LEVEL POOLS
// ============================================

// Level 1: Easy Compound Words
const level1Pool = [
  ["pan", "cake", "pancake", ["pancake"]],
  ["back", "yard", "backyard", ["backyard", "back yard"]],
  ["fire", "place", "fireplace", ["fireplace", "fire place"]],
  ["out", "side", "outside", ["outside", "out side"]],
  ["cart", "wheel", "cartwheel", ["cartwheel", "cart wheel"]],
].map(([a, b, answer, accepted], i) =>
  createLevel(
    "compound_words",
    `compound-easy-${i + 1}`,
    [textClue(a), textClue(b)],
    answer,
    accepted,
  ),
);

// Level 2: Easy Split Image (Animals)
const level2Pool = [
  ["frog", "frog", ["frog"]],
  ["elephant", "elephant", ["elephant"]],
  ["sheep", "sheep", ["sheep", "lamb"]],
].map(([imageKey, answer, accepted]) =>
  createSplitImageLevel("easy", imageKey, answer, accepted, "animal"),
);

// Level 3: Easy Math Relay
const level3Pool = [
  ["x + y = 10", "x − y = 4", "7", ["7", "seven", "x=7", "x = 7"]],
  ["x + y = 8", "x − y = 2", "5", ["5", "five", "x=5", "x = 5"]],
  ["x + y = 15", "x − y = 3", "9", ["9", "nine", "x=9", "x = 9"]],
].map(([eq1, eq2, answer, accepted], i) =>
  createLevel(
    "math_relay",
    `math-easy-${i + 1}`,
    [textClue(eq1), textClue(eq2)],
    answer,
    accepted,
  ),
);

// Level 4: Easy Coordinates (Major Cities)
const level4Pool = [
  ["48.8566° N", "2.3522° E", "paris", ["paris"]],
  ["35.6762° N", "139.6503° E", "tokyo", ["tokyo"]],
  [
    "40.7128° N",
    "74.0060° W",
    "new york",
    ["new york", "nyc", "new york city"],
  ],
  ["33.8688° S", "151.2093° E", "sydney", ["sydney"]],
  ["51.5074° N", "0.1278° W", "london", ["london"]],
].map(([lat, lon, answer, accepted], i) =>
  createLevel(
    "coordinates",
    `coords-easy-${i + 1}`,
    [textClue(`Latitude: ${lat}`), textClue(`Longitude: ${lon}`)],
    answer,
    accepted,
  ),
);

// Level 5: Easy Document Extraction
const level5Pool = [
  ["https://paulgraham.com/foundermode.html", "paulgraham.com/foundermode.html", "3rd paragraph, 5th word", "event", ["event"]],
  ["https://en.wikipedia.org/wiki/Earth", "wikipedia.org/wiki/Earth", "1st sentence, 3rd word", "third", ["third"]],
  ["https://en.wikipedia.org/wiki/Moon", "wikipedia.org/wiki/Moon", "1st sentence, 8th word", "natural", ["natural"]]
].map(([url, display, instruction, answer, accepted], i) =>
  createLevel("document_extraction", `doc-easy-${i + 1}`,
    [linkClue(url, display), textClue(instruction)], answer, accepted)
);

// Level 6: Medium Word Association (position + object = part)
const level6Pool = [
  ["bottom", "tree", "roots", ["roots", "root"]],
  ["center", "apple", "core", ["core"]],
  ["middle", "donut", "hole", ["hole"]],
  ["edge", "bread", "crust", ["crust"]],
  ["outside", "egg", "shell", ["shell", "eggshell"]],
].map(([a, b, answer, accepted], i) =>
  createLevel(
    "word_association",
    `word-assoc-medium-${i + 1}`,
    [textClue(a), textClue(b)],
    answer,
    accepted,
  ),
);

// Level 7: Medium Split Image (Food)
const level7Pool = [
  ["apple", "apple", ["apple", "apples"]],
  ["eggs", "eggs", ["eggs", "egg"]],
  ["honey", "honey", ["honey"]],
].map(([imageKey, answer, accepted]) =>
  createSplitImageLevel("medium", imageKey, answer, accepted, "food"),
);

// Level 8: Medium Math Relay (coefficients)
const level8Pool = [
  ["2x + y = 11", "x + y = 7", "4", ["4", "four", "x=4", "x = 4"]],
  ["3x + y = 14", "x + y = 6", "4", ["4", "four", "x=4", "x = 4"]],
  ["2x + y = 17", "x − y = 1", "6", ["6", "six", "x=6", "x = 6"]],
].map(([eq1, eq2, answer, accepted], i) =>
  createLevel(
    "math_relay",
    `math-medium-${i + 1}`,
    [textClue(eq1), textClue(eq2)],
    answer,
    accepted,
  ),
);

// Level 9: Medium Coordinates (Famous Landmarks)
const level9Pool = [
  ["48.8584° N", "2.2945° E", "eiffel tower", ["eiffel tower", "eiffel"]],
  [
    "40.6892° N",
    "74.0445° W",
    "statue of liberty",
    ["statue of liberty", "liberty"],
  ],
  ["27.1751° N", "78.0421° E", "taj mahal", ["taj mahal", "taj"]],
  ["41.8902° N", "12.4922° E", "colosseum", ["colosseum", "coliseum"]],
  ["51.5007° N", "0.1246° W", "big ben", ["big ben"]],
].map(([lat, lon, answer, accepted], i) =>
  createLevel(
    "coordinates",
    `coords-medium-${i + 1}`,
    [textClue(`Latitude: ${lat}`), textClue(`Longitude: ${lon}`)],
    answer,
    accepted,
    [],
    { instructions: "What landmark is this?" },
  ),
);
// Level 10: Medium Document Extraction (2 Loopy, 3 Ulysse essays)
const level10Pool = [
  ["https://strangestloop.io/essays/the-strangest-loop", "strangestloop.io/essays/the-strangest-loop", "Paragraph 2, last word", "contradiction", ["contradiction"]],
  ["https://strangestloop.io/essays/life-as-a-puzzle", "strangestloop.io/essays/life-as-a-puzzle", "Paragraph 6, last word", "spiritually", ["spiritually"]],
  ["https://ulyssepence.com/blog/post/friends-not-critics", "ulyssepence.com/blog/post/friends-not-critics", "1st paragraph, last word", "persuasive", ["persuasive"]],
  ["https://ulyssepence.com/blog/post/the-path-to-greatness", "ulyssepence.com/blog/post/the-path-to-greatness", "Last word of the essay", "begins", ["begins"]],
  ["https://ulyssepence.com/blog/post/bootstrapping-empathy", "ulyssepence.com/blog/post/bootstrapping-empathy", "Last paragraph, last word", "connection", ["connection"]]
].map(([url, display, instruction, answer, accepted], i) =>
  createLevel("document_extraction", `doc-medium-${i + 1}`,
    [linkClue(url, display), textClue(instruction)], answer, accepted)
);
// Level 11: Hard Word Bridge (A + answer, answer + B)
const level11Pool = [
  ["peanut", "fly", "butter", ["butter"]],
  ["base", "room", "ball", ["ball"]],
  ["sweet", "beat", "heart", ["heart"]],
  ["note", "worm", "book", ["book"]],
  ["paper", "yard", "back", ["back"]],
].map(([a, b, answer, accepted], i) =>
  createLevel(
    "word_bridge",
    `word-bridge-hard-${i + 1}`,
    [textClue(a), textClue(b)],
    answer,
    accepted,
  ),
);
// Level 12: Hard Split Image (Vehicles)
const level12Pool = [
  ["helicopter", "helicopter", ["helicopter", "chopper"]],
  ["motorcycle", "motorcycle", ["motorcycle", "motorbike", "bike"]],
  ["sailboat", "sailboat", ["sailboat", "sail boat", "boat", "yacht"]],
].map(([imageKey, answer, accepted]) =>
  createSplitImageLevel("hard", imageKey, answer, accepted, "vehicle"),
);
// Level 13: Hard Math Relay (full elimination)
const level13Pool = [
  ["3x + 2y = 19", "2x + 3y = 16", "5", ["5", "five", "x=5", "x = 5"]],
  ["2x + 3y = 18", "3x + 2y = 17", "3", ["3", "three", "x=3", "x = 3"]],
  ["4x + y = 17", "x + 3y = 18", "3", ["3", "three", "x=3", "x = 3"]],
].map(([eq1, eq2, answer, accepted], i) =>
  createLevel(
    "math_relay",
    `math-hard-${i + 1}`,
    [textClue(eq1), textClue(eq2)],
    answer,
    accepted,
  ),
);
// Level 14: Hard Coordinates (Natural/Historical Sites, DMS format)
const level14Pool = [
  ["36° 3' 19\" N", "112° 7' 19\" W", "grand canyon", ["grand canyon"]],
  [
    "13° 9' 48\" S",
    "72° 32' 44\" W",
    "machu picchu",
    ["machu picchu", "macchu picchu", "machu pichu"],
  ],
  ["51° 10' 44\" N", "1° 49' 34\" W", "stonehenge", ["stonehenge"]],
  [
    "29° 58' 45\" N",
    "31° 8' 3\" E",
    "great pyramid",
    ["great pyramid", "pyramid of giza", "giza", "pyramids"],
  ],
  [
    "27° 59' 17\" N",
    "86° 55' 31\" E",
    "mount everest",
    ["mount everest", "everest", "mt everest"],
  ],
].map(([lat, lon, answer, accepted], i) =>
  createLevel(
    "coordinates",
    `coords-hard-${i + 1}`,
    [textClue(`Latitude: ${lat}`), textClue(`Longitude: ${lon}`)],
    answer,
    accepted,
    [],
    { instructions: "What place is this?" },
  ),
);
// Level 15: Hard Anagram Puzzles (given word + answer = anagram of two-word phrase)
const level15Pool = [
  ["banker brood", "board", "broken", ["broken"]],
  ["moon starer", "rates", "moron", ["moron"]],
  ["las vegas", "gas", "salve", ["salve"]]
].map(([anagram, givenWord, answer, accepted], i) =>
  createLevel("anagram", `anagram-hard-${i + 1}`,
    [textClue(anagram), textClue(givenWord)], answer, accepted)
);

// All pools in order
const levelPools = [
  level1Pool,
  level2Pool,
  level3Pool,
  level4Pool,
  level5Pool,
  level6Pool,
  level7Pool,
  level8Pool,
  level9Pool,
  level10Pool,
  level11Pool,
  level12Pool,
  level13Pool,
  level14Pool,
  level15Pool,
];

// ============================================
// EXPORTS
// ============================================

/**
 * Generate a game session with randomly selected levels
 */
export function generateLevelSet() {
  return levelPools.map((pool, index) => {
    if (pool.length === 0) {
      return {
        id: `placeholder-${index + 1}`,
        level: index + 1,
        type: "placeholder",
        showInstructions: true,
        instructions: "Level coming soon!",
        clues: [textClue("???"), textClue("???")],
        answer: "placeholder",
        acceptedAnswers: ["placeholder"],
        hints: [],
      };
    }
    const selected = pool[Math.floor(Math.random() * pool.length)];
    return { ...selected, level: index + 1 };
  });
}

/**
 * Randomly assign clues to players
 */
export function assignClues(level) {
  const [clueA, clueB] = level.clues;
  const swap = Math.random() > 0.5;
  return {
    playerA: swap ? clueB : clueA,
    playerB: swap ? clueA : clueB,
  };
}

/**
 * Check if an answer is correct (case-insensitive substring match)
 */
export function checkAnswer(message, level) {
  const normalized = message.toLowerCase().trim();
  return level.acceptedAnswers.some((ans) =>
    normalized.includes(ans.toLowerCase()),
  );
}

// For backwards compatibility
export const sampleLevels = generateLevelSet();
export default sampleLevels;
