'use client';

import { useCallback, useState } from 'react';
import { Upload, FileImage } from 'lucide-react';

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
        relative border-2 border-dashed rounded-2xl p-6 md:p-8 text-center 
        transition-all duration-300 glass-card
        ${isDragging 
          ? 'border-emerald-400 bg-emerald-500/10 scale-[1.02]' 
          : 'border-emerald-500/30 hover:border-emerald-400/60'
        }
      `}
    >
      <div className="space-y-3">
        <div className={`
          inline-flex items-center justify-center w-14 h-14 rounded-2xl
          bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg
          transition-transform duration-300
          ${isDragging ? 'scale-110' : 'hover:scale-105'}
        `}>
          {isDragging ? (
            <Upload className="w-7 h-7 text-white animate-bounce" strokeWidth={2} />
          ) : (
            <FileImage className="w-7 h-7 text-white" strokeWidth={2} />
          )}
        </div>

        <div>
          <h3 className="text-base md:text-lg font-semibold mb-1">
            {isDragging ? 'Drop it here!' : 'Drop your image here'}
          </h3>
          <p className="text-sm opacity-60">
            or click to browse
          </p>
        </div>

        <label className="cursor-pointer inline-block">
          <span className="
            px-5 py-2.5 rounded-xl 
            inline-flex items-center gap-2 
            transition-all duration-200 
            transform hover:scale-105 
            font-medium text-sm
            bg-gradient-to-r from-emerald-600 to-teal-600 
            hover:from-emerald-700 hover:to-teal-700
            text-white shadow-md hover:shadow-lg
          ">
            <Upload className="w-4 h-4" strokeWidth={2} />
            Choose Image
          </span>

          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </label>

        <p className="text-xs opacity-50">
          JPG • PNG • WebP • HEIC
        </p>
      </div>
    </div>
  );
}
