/**
 * Image Processing Utilities
 *
 * Functions for dynamically processing images for game clues.
 * Uses HTML Canvas for client-side image manipulation.
 */

/**
 * Load an image and return it as an HTMLImageElement
 * @param {string} src - Image URL
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Create a vertical slice from an image
 * Slice is 25% width, taken from a random position within the middle 50%
 *
 * @param {string} imageSrc - Source image URL
 * @returns {Promise<string>} - Data URL of the sliced image
 */
export async function createRandomVerticalSlice(imageSrc) {
  const img = await loadImage(imageSrc);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Image dimensions
  const imgWidth = img.width;
  const imgHeight = img.height;

  // Slice is 25% of width
  const sliceWidth = Math.floor(imgWidth * 0.25);

  // Random position within middle 50% (from 25% to 75% minus slice width)
  // This ensures the slice stays within the middle region
  const minX = Math.floor(imgWidth * 0.25);
  const maxX = Math.floor(imgWidth * 0.75) - sliceWidth;
  const randomX = minX + Math.floor(Math.random() * (maxX - minX));

  // Set canvas size to slice dimensions
  canvas.width = sliceWidth;
  canvas.height = imgHeight;

  // Draw the slice
  ctx.drawImage(
    img,
    randomX, 0, sliceWidth, imgHeight,  // Source rectangle
    0, 0, sliceWidth, imgHeight          // Destination rectangle
  );

  return canvas.toDataURL('image/jpeg', 0.9);
}

/**
 * Create a pixelated version of an image
 * Scales down to tiny size then back up for blocky effect
 *
 * @param {string} imageSrc - Source image URL
 * @param {number} pixelSize - Size to scale down to (default 20)
 * @returns {Promise<string>} - Data URL of the pixelated image
 */
export async function createPixelatedImage(imageSrc, pixelSize = 20) {
  const img = await loadImage(imageSrc);

  // First canvas: scale down
  const smallCanvas = document.createElement('canvas');
  const smallCtx = smallCanvas.getContext('2d');
  smallCanvas.width = pixelSize;
  smallCanvas.height = pixelSize;

  // Disable smoothing for crisp pixels
  smallCtx.imageSmoothingEnabled = false;
  smallCtx.drawImage(img, 0, 0, pixelSize, pixelSize);

  // Second canvas: scale back up
  const largeCanvas = document.createElement('canvas');
  const largeCtx = largeCanvas.getContext('2d');
  largeCanvas.width = img.width;
  largeCanvas.height = img.height;

  // Disable smoothing to preserve blocky pixels
  largeCtx.imageSmoothingEnabled = false;
  largeCtx.drawImage(smallCanvas, 0, 0, img.width, img.height);

  return largeCanvas.toDataURL('image/jpeg', 0.9);
}

/**
 * Preload and process images for a level
 * Call this before the level starts to have images ready
 *
 * @param {Object} level - Level object with clues
 * @returns {Promise<Object>} - Processed clues with data URLs
 */
export async function processLevelImages(level) {
  if (level.type !== 'split_image') {
    return level.clues;
  }

  const processedClues = await Promise.all(
    level.clues.map(async (clue) => {
      if (clue.type !== 'image') return clue;

      // Check if this is a slice or pixelated clue
      if (clue.processAs === 'slice') {
        const sliceDataUrl = await createRandomVerticalSlice(clue.sourceImage);
        return { ...clue, value: sliceDataUrl, type: 'image' };
      }

      if (clue.processAs === 'pixelated') {
        const pixelatedDataUrl = await createPixelatedImage(clue.sourceImage);
        return { ...clue, value: pixelatedDataUrl, type: 'image' };
      }

      return clue;
    })
  );

  return processedClues;
}

export default {
  loadImage,
  createRandomVerticalSlice,
  createPixelatedImage,
  processLevelImages
};
