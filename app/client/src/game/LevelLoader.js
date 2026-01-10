/**
 * Level Loader
 *
 * Scalable system for loading and managing 50-100+ levels.
 * Supports:
 * - Lazy loading of level data
 * - Preloading upcoming levels
 * - Image preprocessing pipeline
 * - Level packs/categories
 */

import { sampleLevels } from './levels/sampleLevels';
import { processLevelImages } from './imageUtils';

// Cache for processed levels
const processedLevelCache = new Map();

// Preload queue
let preloadQueue = [];
let isPreloading = false;

/**
 * Get all available levels
 * In the future, this could fetch from an API
 */
export function getAllLevels() {
  return sampleLevels;
}

/**
 * Get total level count
 */
export function getLevelCount() {
  return sampleLevels.length;
}

/**
 * Get a specific level by index
 */
export function getLevel(index) {
  if (index < 0 || index >= sampleLevels.length) {
    return null;
  }
  return sampleLevels[index];
}

/**
 * Check if a level needs image preprocessing
 */
export function levelNeedsProcessing(level) {
  if (!level || !level.clues) return false;
  return level.clues.some(clue =>
    clue.type === 'image' && clue.processAs
  );
}

/**
 * Get processed clues for a level
 * Returns cached version if available, otherwise processes
 */
export async function getProcessedLevel(levelIndex) {
  // Check cache first
  if (processedLevelCache.has(levelIndex)) {
    return processedLevelCache.get(levelIndex);
  }

  const level = getLevel(levelIndex);
  if (!level) return null;

  // If no processing needed, return original clues
  if (!levelNeedsProcessing(level)) {
    return level.clues;
  }

  // Process the level
  const processedClues = await processLevelImages(level);
  processedLevelCache.set(levelIndex, processedClues);

  return processedClues;
}

/**
 * Preload levels ahead of current position
 * Call this to prepare upcoming levels in the background
 *
 * @param {number} currentIndex - Current level index
 * @param {number} lookAhead - How many levels to preload (default 2)
 */
export async function preloadUpcomingLevels(currentIndex, lookAhead = 2) {
  const totalLevels = getLevelCount();

  for (let i = 1; i <= lookAhead; i++) {
    const targetIndex = currentIndex + i;
    if (targetIndex >= totalLevels) break;

    // Add to queue if not already cached
    if (!processedLevelCache.has(targetIndex)) {
      preloadQueue.push(targetIndex);
    }
  }

  // Start processing queue
  processPreloadQueue();
}

/**
 * Process the preload queue
 */
async function processPreloadQueue() {
  if (isPreloading || preloadQueue.length === 0) return;

  isPreloading = true;

  while (preloadQueue.length > 0) {
    const levelIndex = preloadQueue.shift();

    // Skip if already cached (might have been processed while waiting)
    if (processedLevelCache.has(levelIndex)) continue;

    try {
      await getProcessedLevel(levelIndex);
    } catch (error) {
      // Silently handle preload failures - game will still work
    }
  }

  isPreloading = false;
}

/**
 * Clear the processed level cache
 * Useful for memory management in long sessions
 */
export function clearCache() {
  processedLevelCache.clear();
}

/**
 * Clear cache for levels before a certain index
 * Keeps upcoming levels but frees memory from completed ones
 */
export function clearOldLevels(currentIndex) {
  for (const [index] of processedLevelCache) {
    if (index < currentIndex - 1) {
      processedLevelCache.delete(index);
    }
  }
}

/**
 * Level metadata for UI display
 */
export function getLevelMetadata(levelIndex) {
  const level = getLevel(levelIndex);
  if (!level) return null;

  return {
    level: level.level,
    type: level.type,
    id: level.id,
    requiresInternet: level.type === 'document_extraction' ||
                      level.type === 'coordinates' ||
                      level.type === 'wikipedia_race'
  };
}

/**
 * Get levels by type (for future category selection)
 */
export function getLevelsByType(type) {
  return sampleLevels.filter(level => level.type === type);
}

/**
 * Get all available level types
 */
export function getAvailableLevelTypes() {
  const types = new Set(sampleLevels.map(level => level.type));
  return Array.from(types);
}

export default {
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
};
