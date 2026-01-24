// lib/imageCompression.ts

// Platform-specific settings
const platformSettings = {
  instagram: {
    maxWidth: 1440,
    quality: 0.92,
    sharpenAmount: 1.12,
    saturationBoost: 1.08,
  },
  linkedin: {
    maxWidth: 1200,
    quality: 0.90,
    sharpenAmount: 1.05,
    saturationBoost: 1.02,
  },
  tiktok: {
    maxWidth: 1080,
    quality: 0.88,
    sharpenAmount: 1.10,
    saturationBoost: 1.05,
  },
};

// Simple face detection using browser's built-in capabilities
// We'll use a simpler approach that works without MediaPipe for now
async function detectFaces(imageElement: HTMLImageElement): Promise<any[]> {
  // For MVP, we'll return empty array (face detection optional)
  // The compression will still work with platform optimization
  console.log('Face detection: Using simplified mode');
  return [];
}

// Main compression function
export async function compressImage(
  file: File,
  platform: 'instagram' | 'linkedin' | 'tiktok'
) {
  const settings = platformSettings[platform];
  const originalSize = file.size;

  return new Promise<{
    compressedUrl: string;
    originalSize: number;
    compressedSize: number;
    facesDetected: number;
  }>((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = async (e) => {
      img.onload = async () => {
        try {
          // Step 1: Detect faces (simplified for now)
          console.log('🔍 Analyzing image...');
          const faces = await detectFaces(img);
          console.log(`✅ Analysis complete`);

          // Step 2: Create canvas with platform dimensions
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

          // Calculate dimensions
          const scale = Math.min(settings.maxWidth / img.width, 1);
          canvas.width = Math.floor(img.width * scale);
          canvas.height = Math.floor(img.height * scale);

          // Draw image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Step 3: Apply platform-specific enhancements
          console.log('🎨 Applying enhancements...');
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Apply saturation boost (platform-specific)
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = Math.min(255, avg + (data[i] - avg) * settings.saturationBoost);
            data[i + 1] = Math.min(255, avg + (data[i + 1] - avg) * settings.saturationBoost);
            data[i + 2] = Math.min(255, avg + (data[i + 2] - avg) * settings.saturationBoost);
          }

          ctx.putImageData(imageData, 0, 0);

          // Step 4: Compress with platform-specific quality
          console.log('🗜️ Compressing...');
          
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Compression failed'));
                return;
              }

              const compressedUrl = URL.createObjectURL(blob);
              
              console.log(`✅ Compressed: ${(originalSize/1024).toFixed(0)}KB → ${(blob.size/1024).toFixed(0)}KB`);
              
              resolve({
                compressedUrl,
                originalSize,
                compressedSize: blob.size,
                facesDetected: faces.length,
              });
            },
            'image/jpeg',
            settings.quality
          );
        } catch (error) {
          console.error('Compression error:', error);
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
