import Pica from 'pica';
import heic2any from 'heic2any';

const picaInstance = Pica();

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = async () => {
      try {
        // Ensures decoding is complete in modern browsers
        if ('decode' in img) await img.decode();
      } catch {
        // Even if decode fails, onload means it's usable; continue
      } finally {
        // Prevent object URL leaks
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
    const convertedBlob = await heic2any({
      blob: file,
      toType: 'image/png', // Lossless conversion
    });

    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    return new File([blob], file.name.replace(/\.heic$/i, '.png'), {
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

  // Convert HEIC to PNG first if needed (lossless step)
  let processedFile = file;
  if (
    file.type === 'image/heic' || 
    file.type === 'image/heif' || 
    file.name.toLowerCase().endsWith('.heic')
  ) {
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

  // High quality JPEG compression (single lossy step for HEIC)
  const quality = 0.92;
  const blob = await picaInstance.toBlob(finalCanvas, 'image/jpeg', quality);

  // Use original file size for comparison (HEIC original, not PNG intermediate)
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
