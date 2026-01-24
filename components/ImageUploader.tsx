'use client';

import { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
}

export default function ImageUploader({ onFileSelect }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      className={`
        border-2 border-dashed rounded-3xl p-16 text-center 
        transition-all duration-300 glass-effect
        ${isDragging 
          ? 'border-pink-400 bg-pink-500/10 scale-105' 
          : 'border-purple-400/50 hover:border-purple-400'
        }
      `}
    >
      <div className="text-8xl mb-6 transform hover:scale-110 transition-transform duration-300">
        📸
      </div>
      <h3 className="text-white text-2xl font-bold mb-3">
        Drop your image here
      </h3>
      <p className="text-gray-300 mb-8 text-lg">
        or click the button below to browse
      </p>
      <label className="cursor-pointer group">
        <span className="glass-effect-strong hover:bg-white/25 text-white px-10 py-4 rounded-full inline-flex items-center gap-3 transition-all duration-300 transform group-hover:scale-105 font-semibold text-lg">
          <span className="text-2xl">🖼️</span>
          Choose Image
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </label>
      <p className="text-gray-400 text-sm mt-6">
        Supports: JPG, PNG, WebP, HEIC
      </p>
    </div>
  );
}
