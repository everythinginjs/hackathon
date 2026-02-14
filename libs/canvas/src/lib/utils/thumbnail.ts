/**
 * Calculates thumbnail dimensions that fit within max bounds while maintaining aspect ratio
 * @param canvasWidth - The width of the canvas
 * @param canvasHeight - The height of the canvas
 * @param maxWidth - Maximum thumbnail width (default: 220)
 * @param maxHeight - Maximum thumbnail height (default: 300)
 * @returns Object containing thumbnailWidth, thumbnailHeight, and scale multiplier
 */
export function calculateThumbnailDimensions(
  canvasWidth: number,
  canvasHeight: number,
  maxWidth = 220,
  maxHeight = 300
) {
  // Calculate aspect ratio
  const aspectRatio = canvasWidth / canvasHeight;

  // Calculate thumbnail dimensions that fit within max bounds while maintaining aspect ratio
  let thumbnailWidth = maxWidth;
  let thumbnailHeight = maxWidth / aspectRatio;

  // If height exceeds max, scale by height instead
  if (thumbnailHeight > maxHeight) {
    thumbnailHeight = maxHeight;
    thumbnailWidth = maxHeight * aspectRatio;
  }

  // Calculate scale multiplier for canvas rendering
  const scale = thumbnailWidth / canvasWidth;

  return {
    thumbnailWidth,
    thumbnailHeight,
    scale,
  };
}
