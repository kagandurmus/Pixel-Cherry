import Pica from 'pica';

const picaInstance = Pica();

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = async () => {
      try {
        if ('decode' in img) await img.decode();
      } catch {
        // Continue even if decode fails
      } finally {
        URL.revokeObjectURL(url);
      }
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

async function convertHeicToPng(file: File): Promise<File> {
  try {
    // Dynamic import for Turbopack compatibility
    const { heicTo } = await import('heic-to');
    
    const convertedBlob = await heicTo({
      blob: file,
      type: 'image/png', // Lossless conversion
      quality: 1
    });

    return new File([convertedBlob], file.name.replace(/\.heic$/i, '.png'), {
      type: 'image/png',
    });
  } catch (error) {
    console.error('HEIC to PNG conversion failed:', error);
    throw new Error('Failed to convert HEIC image. Please try a different format.');
  }
}

export async function compressImage(file: File) {
  if (typeof window === 'undefined') {
    throw new Error('compressImage must run in the browser');
  }

  // Store original file info
  const isHeic = file.type === 'image/heic' || 
                 file.type === 'image/heif' || 
                 file.name.toLowerCase().endsWith('.heic');

  // Convert HEIC to PNG first if needed (lossless step)
  let processedFile = file;
  if (isHeic) {
    processedFile = await convertHeicToPng(file);
  }

  const img = await loadImageFromFile(processedFile);

  const originalWidth = img.naturalWidth;
  const originalHeight = img.naturalHeight;

  const MAX_DIMENSION = 3840;
  let targetWidth = originalWidth;
  let targetHeight = originalHeight;

  if (originalWidth > MAX_DIMENSION || originalHeight > MAX_DIMENSION) {
    const aspectRatio = originalWidth / originalHeight;
    if (originalWidth > originalHeight) {
      targetWidth = MAX_DIMENSION;
      targetHeight = Math.round(MAX_DIMENSION / aspectRatio);
    } else {
      targetHeight = MAX_DIMENSION;
      targetWidth = Math.round(MAX_DIMENSION * aspectRatio);
    }
  }

  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = originalWidth;
  sourceCanvas.height = originalHeight;

  const sourceCtx = sourceCanvas.getContext('2d');
  if (!sourceCtx) throw new Error('Failed to get 2D context');
  sourceCtx.drawImage(img, 0, 0);

  let finalCanvas = sourceCanvas;

  if (targetWidth !== originalWidth || targetHeight !== originalHeight) {
    const destCanvas = document.createElement('canvas');
    destCanvas.width = targetWidth;
    destCanvas.height = targetHeight;

    await picaInstance.resize(sourceCanvas, destCanvas, {
      quality: 3,
      unsharpAmount: 40,
      unsharpRadius: 0.5,
      unsharpThreshold: 2,
    });

    finalCanvas = destCanvas;
  }

  // For HEIC files, start with lower quality and iterate until smaller
  let quality = isHeic ? 0.88 : 0.92;
  let blob = await picaInstance.toBlob(finalCanvas, 'image/jpeg', quality);

  // For HEIC: Reduce quality until output is smaller than input
  if (isHeic) {
    let attempts = 0;
    while (blob.size >= file.size && quality > 0.70 && attempts < 5) {
      quality -= 0.04;
      blob = await picaInstance.toBlob(finalCanvas, 'image/jpeg', quality);
      attempts++;
    }

    return {
      compressedUrl: URL.createObjectURL(blob),
      originalSize: file.size,
      compressedSize: blob.size,
      message: 'heic-converted' as const,
    };
  }

  // For other formats, check if compression is beneficial
  if (blob.size >= file.size * 0.95) {
    const originalUrl = URL.createObjectURL(file);
    return {
      compressedUrl: originalUrl,
      originalSize: file.size,
      compressedSize: file.size,
      message: 'already-optimized' as const,
    };
  }

  const reductionPercent = ((file.size - blob.size) / file.size) * 100;
  if (reductionPercent > 70) {
    const betterBlob = await picaInstance.toBlob(finalCanvas, 'image/jpeg', 0.98);

    if (betterBlob.size >= file.size * 0.95) {
      const originalUrl = URL.createObjectURL(file);
      return {
        compressedUrl: originalUrl,
        originalSize: file.size,
        compressedSize: file.size,
        message: 'already-optimized' as const,
      };
    }

    return {
      compressedUrl: URL.createObjectURL(betterBlob),
      originalSize: file.size,
      compressedSize: betterBlob.size,
    };
  }

  return {
    compressedUrl: URL.createObjectURL(blob),
    originalSize: file.size,
    compressedSize: blob.size,
  };
}
