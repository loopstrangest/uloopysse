/**
 * Game Module Exports
 *
 * Main entry point for the collaborative puzzle game system.
 */

// Level data and utilities
export {
  sampleLevels,
  assignClues,
  checkAnswer
} from './levels/sampleLevels';

// UI Components
export {
  default as GameMessage,
  LevelIndicator,
  Instructions,
  Clue,
  CorrectAnswer,
  LevelTransition,
  GameStats,
  Hint,
  ErrorMessage
} from './GameMessage';

// Image processing utilities
export {
  loadImage,
  createRandomVerticalSlice,
  createPixelatedImage,
  processLevelImages
} from './imageUtils';

// Level loader (scalable for 50-100+ levels)
export {
  getAllLevels,
  getLevelCount,
  getLevel,
  getProcessedLevel,
  levelNeedsProcessing,
  preloadUpcomingLevels,
  clearCache,
  clearOldLevels,
  getLevelMetadata,
  getLevelsByType,
  getAvailableLevelTypes
} from './LevelLoader';

// CSS import helper (import this in your main app)
export const importStyles = () => import('./GameTypography.css');
