import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

let faceDetector: FaceDetector | null = null;

async function initializeFaceDetector() {
  if (faceDetector) return faceDetector;

  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
  );

  faceDetector = await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
      delegate: 'GPU',
    },
    runningMode: 'IMAGE',
    minDetectionConfidence: 0.5,
  });

  return faceDetector;
}

const platformSettings = {
  instagram: {
    maxWidth: 1440,
    maxHeight: 1440,
    quality: 0.88,  // Improved from 0.82
    format: 'image/jpeg' as const,
    saturationBoost: 1.08,
  },
  linkedin: {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.90,  // Improved from 0.85
    format: 'image/jpeg' as const,
    saturationBoost: 1.0,
  },
  tiktok: {
    maxWidth: 1080,
    maxHeight: 1920,
    quality: 0.86,  // Improved from 0.80
    format: 'image/jpeg' as const,
    saturationBoost: 1.12,
  },
};

export async function compressImage(
  file: File,
  platform: 'instagram' | 'linkedin' | 'tiktok'
) {
  const settings = platformSettings[platform];

  // Detect faces
  const detector = await initializeFaceDetector();
  const image = await createImageBitmap(file);
  const detections = detector.detect(image);
  const facesDetected = detections.detections.length;

  // Face-aware quality adjustment
  // If faces detected, boost quality by 5% to preserve face details
  const quality = facesDetected > 0 
    ? Math.min(settings.quality + 0.05, 0.95)  // Max 0.95 quality
    : settings.quality;

  return new Promise<{
    compressedUrl: string;
    originalSize: number;
    compressedSize: number;
    facesDetected: number;
  }>((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      // Calculate dimensions
      let { width, height } = img;
      const aspectRatio = width / height;

      if (width > settings.maxWidth || height > settings.maxHeight) {
        if (aspectRatio > 1) {
          width = settings.maxWidth;
          height = Math.round(width / aspectRatio);
        } else {
          height = settings.maxHeight;
          width = Math.round(height * aspectRatio);
        }
      }

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;

      // Apply saturation boost
      ctx.filter = `saturate(${settings.saturationBoost})`;
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Compression failed'));
            return;
          }

          const compressedUrl = URL.createObjectURL(blob);
          
          resolve({
            compressedUrl,
            originalSize: file.size,
            compressedSize: blob.size,
            facesDetected,
          });
        },
        settings.format,
        quality  // Using face-aware quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    reader.readAsDataURL(file);
  });
}
