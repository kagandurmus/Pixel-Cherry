import Pica from 'pica';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';



let faceDetector: FaceDetector | null = null;
const picaInstance = Pica();



async function initializeFaceDetector() {
  if (faceDetector) return faceDetector;



  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
  );



  faceDetector = await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
      delegate: 'CPU',
    },
    runningMode: 'IMAGE',
    minDetectionConfidence: 0.5,
  });



  return faceDetector;
}



export async function compressImage(file: File) {
  // Detect faces
  const detector = await initializeFaceDetector();
  const image = await createImageBitmap(file);
  const detections = detector.detect(image);
  const facesDetected = detections.detections.length;



  return new Promise<{
    compressedUrl: string;
    originalSize: number;
    compressedSize: number;
    facesDetected: number;
    message?: string;
  }>((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();



    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };



    img.onload = async () => {
      try {
        const originalWidth = img.naturalWidth;
        const originalHeight = img.naturalHeight;
        
        console.log('Original dimensions:', originalWidth, 'x', originalHeight);
        console.log('Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
        console.log('Faces detected:', facesDetected);



        // MUCH more conservative resizing - only if REALLY large
        const MAX_DIMENSION = 3840; // 4K
        let targetWidth = originalWidth;
        let targetHeight = originalHeight;
        
        // Only resize if one dimension is > 3840px
        if (originalWidth > MAX_DIMENSION || originalHeight > MAX_DIMENSION) {
          const aspectRatio = originalWidth / originalHeight;
          
          if (originalWidth > originalHeight) {
            targetWidth = MAX_DIMENSION;
            targetHeight = Math.round(MAX_DIMENSION / aspectRatio);
          } else {
            targetHeight = MAX_DIMENSION;
            targetWidth = Math.round(MAX_DIMENSION * aspectRatio);
          }
          
          console.log('Resizing to:', targetWidth, 'x', targetHeight);
        } else {
          console.log('No resize needed - keeping original dimensions');
        }



        // Source canvas
        const sourceCanvas = document.createElement('canvas');
        sourceCanvas.width = originalWidth;
        sourceCanvas.height = originalHeight;
        const sourceCtx = sourceCanvas.getContext('2d')!;
        sourceCtx.drawImage(img, 0, 0);



        let finalCanvas = sourceCanvas;



        // Only resize if dimensions changed
        if (targetWidth !== originalWidth || targetHeight !== originalHeight) {
          const destCanvas = document.createElement('canvas');
          destCanvas.width = targetWidth;
          destCanvas.height = targetHeight;



          await picaInstance.resize(sourceCanvas, destCanvas, {
            quality: 3,
            unsharpAmount: 40, // Very light sharpening
            unsharpRadius: 0.5,
            unsharpThreshold: 2,
          });



          finalCanvas = destCanvas;
        }



        // High quality JPEG compression
        // Start with 0.92 quality, boost to 0.95 if faces detected
        let quality = facesDetected > 0 ? 0.95 : 0.92;
        
        console.log('Using JPEG quality:', quality);



        const blob = await picaInstance.toBlob(finalCanvas, 'image/jpeg', quality);
        
        const reductionPercent = ((file.size - blob.size) / file.size) * 100;
        console.log('Compressed size:', (blob.size / 1024).toFixed(0), 'KB');
        console.log('Reduction:', reductionPercent.toFixed(1), '%');



        // Check if compressed is larger or barely smaller
        if (blob.size >= file.size * 0.95) {
          console.log('Image already optimally compressed - using original');
          
          const originalUrl = URL.createObjectURL(file);
          
          resolve({
            compressedUrl: originalUrl,
            originalSize: file.size,
            compressedSize: file.size,
            facesDetected,
            message: 'already-optimized'
          });
          return;
        }



        // Safety valve: if reduction > 70%, retry with max quality
        if (reductionPercent > 70) {
          console.warn('Reduction too high! Retrying with quality 0.98');
          const betterBlob = await picaInstance.toBlob(finalCanvas, 'image/jpeg', 0.98);
          
          // Check again after retry
          if (betterBlob.size >= file.size * 0.95) {
            const originalUrl = URL.createObjectURL(file);
            resolve({
              compressedUrl: originalUrl,
              originalSize: file.size,
              compressedSize: file.size,
              facesDetected,
              message: 'already-optimized'
            });
            return;
          }
          
          const betterReduction = ((file.size - betterBlob.size) / file.size) * 100;
          console.log('New compressed size:', (betterBlob.size / 1024).toFixed(0), 'KB');
          console.log('New reduction:', betterReduction.toFixed(1), '%');
          
          const compressedUrl = URL.createObjectURL(betterBlob);
          
          resolve({
            compressedUrl,
            originalSize: file.size,
            compressedSize: betterBlob.size,
            facesDetected,
          });
          return;
        }



        const compressedUrl = URL.createObjectURL(blob);



        resolve({
          compressedUrl,
          originalSize: file.size,
          compressedSize: blob.size,
          facesDetected,
        });
      } catch (error) {
        console.error('Compression error:', error);
        reject(error);
      }
    };



    img.onerror = () => reject(new Error('Failed to load image'));
    reader.readAsDataURL(file);
  });
}