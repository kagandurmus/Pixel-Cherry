import Pica from 'pica';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

let faceDetector: FaceDetector | null = null;
let visionFileset: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>> | null = null;
let initPromise: Promise<FaceDetector> | null = null;

const picaInstance = Pica();

async function getVisionFileset() {
  if (visionFileset) return visionFileset;
  visionFileset = await FilesetResolver.forVisionTasks('/wasm/vision'); // local wasm base [web:63]
  return visionFileset;
}

async function initializeFaceDetector(): Promise<FaceDetector> {
  if (faceDetector) return faceDetector;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const vision = await getVisionFileset();

    // Use local model to avoid any fetch/CORS issues with gcs
    const modelPath = '/models/blaze_face_short_range.tflite';

    // NPM example uses createFromModelPath + detect(image) [web:57]
    const detector = await FaceDetector.createFromModelPath(vision, modelPath);

    faceDetector = detector;
    return detector;
  })();

  try {
    return await initPromise;
  } finally {
    initPromise = null;
  }
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = async () => {
      try {
        // Ensures decoding is complete in modern browsers
        if ('decode' in img) await img.decode();
        resolve(img);
      } catch (e) {
        // Even if decode fails, onload means it’s usable; continue
        resolve(img);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

export async function compressImage(file: File) {
  if (typeof window === 'undefined') {
    throw new Error('compressImage must run in the browser');
  }

  const img = await loadImageFromFile(file);

  // Face detection (non-fatal)
  let facesDetected = 0;
  try {
    const detector = await initializeFaceDetector();
    const detections = detector.detect(img);
    facesDetected = detections.detections.length;
  } catch (e) {
    // This will finally show you the *real* error (expand it in console)
    console.error('FaceDetector.detect failed:', e);
    facesDetected = 0;
  }

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

  const quality = facesDetected > 0 ? 0.95 : 0.92;
  const blob = await picaInstance.toBlob(finalCanvas, 'image/jpeg', quality); // pica usage [web:151]

  if (blob.size >= file.size * 0.95) {
    const originalUrl = URL.createObjectURL(file);
    return {
      compressedUrl: originalUrl,
      originalSize: file.size,
      compressedSize: file.size,
      facesDetected,
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
        facesDetected,
        message: 'already-optimized' as const,
      };
    }

    return {
      compressedUrl: URL.createObjectURL(betterBlob),
      originalSize: file.size,
      compressedSize: betterBlob.size,
      facesDetected,
    };
  }

  return {
    compressedUrl: URL.createObjectURL(blob),
    originalSize: file.size,
    compressedSize: blob.size,
    facesDetected,
  };
}
