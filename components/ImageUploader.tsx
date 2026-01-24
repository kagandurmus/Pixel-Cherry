'use client';

import { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles, FileImage } from 'lucide-react';

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
        relative border-2 border-dashed rounded-3xl p-16 text-center 
        transition-all duration-300 glass-card overflow-hidden
        ${isDragging 
          ? 'border-emerald-400 bg-emerald-500/10 scale-[1.02] shadow-2xl shadow-emerald-500/20' 
          : 'border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-xl'
        }
      `}
    >
      {/* Animated background gradient on drag */}
      {isDragging && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-rose-500/10 animate-pulse" />
      )}

      {/* Sparkle effects on corners when dragging */}
      {isDragging && (
        <>
          <Sparkles className="absolute top-4 left-4 w-6 h-6 text-emerald-400 animate-pulse" />
          <Sparkles className="absolute top-4 right-4 w-6 h-6 text-rose-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
          <Sparkles className="absolute bottom-4 left-4 w-6 h-6 text-teal-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
          <Sparkles className="absolute bottom-4 right-4 w-6 h-6 text-emerald-400 animate-pulse" style={{ animationDelay: '0.9s' }} />
        </>
      )}

      <div className="relative z-10">
        {/* Main icon with gradient background */}
        <div className={`
          inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6
          bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg
          transition-all duration-300 transform
          ${isDragging ? 'scale-110 rotate-6 shadow-emerald-500/50' : 'hover:scale-105'}
        `}>
          {isDragging ? (
            <Upload className="w-12 h-12 text-white animate-bounce" strokeWidth={2.5} />
          ) : (
            <ImageIcon className="w-12 h-12 text-white" strokeWidth={2.5} />
          )}
        </div>

        {/* Title */}
        <h3 className={`
          text-2xl font-bold mb-3 transition-all duration-300
          ${isDragging 
            ? 'bg-gradient-to-r from-emerald-500 to-rose-500 bg-clip-text text-transparent scale-105' 
            : ''
          }
        `}>
          {isDragging ? 'Drop it right here!' : 'Drop your image here'}
        </h3>

        {/* Description */}
        <p className="opacity-70 mb-8 text-lg">
          or click the button below to browse
        </p>

        {/* Upload button */}
        <label className="cursor-pointer group inline-block">
          <span className={`
            px-10 py-4 rounded-2xl 
            inline-flex items-center gap-3 transition-all duration-300 
            transform group-hover:scale-105 font-semibold text-lg
            bg-gradient-to-r from-emerald-600 to-teal-600 
            hover:from-emerald-700 hover:to-teal-700
            text-white shadow-lg hover:shadow-xl hover:shadow-emerald-500/30
            `}>
            <FileImage className="w-6 h-6 text-white" strokeWidth={2.5} />
            Choose Image
        </span>

          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </label>

        {/* Supported formats with icons */}
        <div className="flex items-center justify-center gap-2 text-sm mt-6 opacity-60">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>JPG</span>
          </div>
          <span className="opacity-40">•</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span>PNG</span>
          </div>
          <span className="opacity-40">•</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>WebP</span>
          </div>
          <span className="opacity-40">•</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>HEIC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
