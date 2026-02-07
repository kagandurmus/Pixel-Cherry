'use client';

import { useState, useRef } from 'react';
import { Download, Share2, Link2, PartyPopper, Sparkles, BarChart3, SlidersHorizontal, RefreshCw } from 'lucide-react';

interface ResultDisplayProps {
  result: {
    compressedUrl: string;
    originalSize: number;
    compressedSize: number;
    facesDetected: number;
    message?: 'already-optimized' | 'heic-converted';
  };
  originalUrl?: string;
}

export default function ResultDisplay({ result, originalUrl }: ResultDisplayProps) {
  const [activeTab, setActiveTab] = useState<'comparison' | 'stats'>('comparison');
  const savingsPercent = ((1 - result.compressedSize / result.originalSize) * 100).toFixed(1);
  const originalMB = (result.originalSize / 1024 / 1024).toFixed(2);
  const compressedKB = (result.compressedSize / 1024).toFixed(0);
  const compressedMB = (result.compressedSize / 1024 / 1024).toFixed(2);

  // HEIC Converted Display
  if (result.message === 'heic-converted') {
    return (
      <div className="mt-12 space-y-6 animate-in fade-in duration-500">
        {/* HEIC Conversion Success */}
        <div className="glass-card rounded-3xl p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <RefreshCw className="w-12 h-12 text-teal-400 animate-spin" style={{ animationDuration: '3s' }} />
            <h3 className="text-4xl font-black bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              HEIC Converted to JPEG!
            </h3>
            <Sparkles className="w-12 h-12 text-blue-400 animate-bounce" />
          </div>
          
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Your HEIC file has been converted to a universal JPEG format for maximum compatibility across all devices and platforms.
          </p>
        </div>

        {/* Format Comparison */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-red-500/20 opacity-50" />
            <div className="relative z-10">
              <div className="text-sm font-semibold opacity-60 uppercase tracking-wide mb-2">HEIC Original</div>
              <div className="text-5xl font-black text-rose-400 mb-2">{originalMB}MB</div>
              <div className="text-xs opacity-70">iPhone format • Limited compatibility</div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-blue-500/20 opacity-50" />
            <div className="relative z-10">
              <div className="text-sm font-semibold opacity-60 uppercase tracking-wide mb-2">JPEG Output</div>
              <div className="text-5xl font-black text-teal-400 mb-2">{compressedMB}MB</div>
              <div className="text-xs opacity-70">Universal format • Works everywhere</div>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Email', icon: '📧', desc: 'No attachment issues' },
            { label: 'Social Media', icon: '📱', desc: 'Instagram, Facebook, X' },
            { label: 'Web', icon: '🌐', desc: 'All browsers' },
            { label: 'Devices', icon: '💻', desc: 'Windows, Android, Mac' },
          ].map((benefit, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 text-center transform hover:scale-105 transition-all">
              <div className="text-3xl mb-2">{benefit.icon}</div>
              <div className="font-bold text-sm mb-1">{benefit.label}</div>
              <div className="text-xs opacity-60">{benefit.desc}</div>
            </div>
          ))}
        </div>

        {/* Preview Image */}
        <div className="glass-card rounded-3xl p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.compressedUrl}
            alt="Converted JPEG result"
            className="w-full rounded-2xl shadow-2xl max-h-[600px] object-contain mx-auto"
          />
        </div>

        {/* Download button */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <a
            href={result.compressedUrl}
            download={`pixel-cherry-converted-${Date.now()}.jpg`}
            className="group block w-full bg-gradient-to-r from-teal-500 via-blue-500 to-teal-500 hover:from-teal-600 hover:via-blue-600 hover:to-teal-600 text-white text-center px-10 py-6 rounded-2xl font-black text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 bg-[length:200%_auto] hover:bg-right"
          >
            <span className="flex items-center justify-center gap-3">
              <Download className="w-7 h-7" strokeWidth={2.5} />
              Download JPEG Image
              <Sparkles className="w-7 h-7 group-hover:animate-bounce" />
            </span>
          </a>

          <div className="flex gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(result.compressedUrl);
                alert('Link copied to clipboard!');
              }}
              className="flex-1 glass-card hover:bg-white/20 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Link2 className="w-5 h-5" />
              Copy Link
            </button>
            <button
              onClick={() => {
                const shareData = {
                  title: 'Pixel Cherry - HEIC Converted',
                  text: 'I converted my HEIC to JPEG with Pixel Cherry!',
                  url: result.compressedUrl,
                };
                if (navigator.share) {
                  navigator.share(shareData);
                } else {
                  alert('Sharing not supported on this device');
                }
              }}
              className="flex-1 glass-card hover:bg-white/20 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular compression display (existing code)
  return (
    <div className="mt-12 space-y-6 animate-in fade-in duration-500">
      {/* Success header */}
      <div className="glass-card rounded-3xl p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <PartyPopper className="w-12 h-12 text-emerald-400 animate-bounce" />
          <h3 className="text-4xl font-black bg-gradient-to-r from-emerald-500 via-teal-600 to-rose-500 bg-clip-text text-transparent animate-gradient-x">
            Compression Complete!
          </h3>
          <Sparkles className="w-12 h-12 text-rose-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
        </div>
        
        {result.message === 'already-optimized' ? (
          <div className="space-y-2">
            <p className="text-xl font-bold text-emerald-400">
              ✨ Already perfectly optimized! ✨
            </p>
            <p className="text-sm opacity-70">
              Your image is already efficiently compressed. Further compression would reduce quality without meaningful file size savings.
            </p>
          </div>
        ) : (
          <p className="text-lg opacity-70">
            Reduced by <span className="font-bold text-emerald-400">{savingsPercent}%</span> while preserving quality
          </p>
        )}
      </div>

      {/* Tab switcher - only show if not already optimized */}
      {result.message !== 'already-optimized' && (
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
              activeTab === 'comparison'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105'
                : 'glass-card hover:scale-105'
            }`}
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Before/After
            </span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
              activeTab === 'stats'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105'
                : 'glass-card hover:scale-105'
            }`}
          >
            <span className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Statistics
            </span>
          </button>
        </div>
      )}

      {/* Content */}
      {activeTab === 'comparison' && originalUrl && result.message !== 'already-optimized' ? (
        <BeforeAfterSlider
          beforeUrl={originalUrl}
          afterUrl={result.compressedUrl}
          beforeSize={result.originalSize}
          afterSize={result.compressedSize}
        />
      ) : (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Saved', value: `${savingsPercent}%`, color: 'text-emerald-400', icon: Download, bg: 'from-emerald-500/20 to-teal-500/20' },
              { label: 'Original', value: `${originalMB}MB`, color: 'text-rose-400', icon: BarChart3, bg: 'from-rose-500/20 to-red-500/20' },
              { label: 'Compressed', value: `${compressedKB}KB`, color: 'text-teal-400', icon: Sparkles, bg: 'from-teal-500/20 to-cyan-500/20' },
              { label: 'Faces', value: result.facesDetected, color: 'text-blue-400', icon: PartyPopper, bg: 'from-blue-500/20 to-indigo-500/20' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="glass-card rounded-2xl p-6 text-center transform hover:scale-105 transition-all relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-50`} />
                  <div className="relative z-10">
                    <Icon className={`w-10 h-10 mx-auto mb-3 ${stat.color}`} strokeWidth={2} />
                    <div className={`text-4xl font-black ${stat.color} mb-2`}>
                      {stat.value}
                    </div>
                    <div className="text-sm opacity-70 font-medium uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Preview Image */}
          <div className="glass-card rounded-3xl p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.compressedUrl}
              alt="Compressed result"
              className="w-full rounded-2xl shadow-2xl max-h-[600px] object-contain mx-auto"
            />
          </div>
        </div>
      )}

      {/* Download button */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <a
          href={result.compressedUrl}
          download={`pixel-cherry-${Date.now()}.jpg`}
          className="group block w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-600 text-white text-center px-10 py-6 rounded-2xl font-black text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 bg-[length:200%_auto] hover:bg-right"
        >
          <span className="flex items-center justify-center gap-3">
            <Download className="w-7 h-7" strokeWidth={2.5} />
            Download {result.message === 'already-optimized' ? 'Original' : 'Compressed'} Image
            <Sparkles className="w-7 h-7 group-hover:animate-bounce" />
          </span>
        </a>

        <div className="flex gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(result.compressedUrl);
              alert('Link copied to clipboard!');
            }}
            className="flex-1 glass-card hover:bg-white/20 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <Link2 className="w-5 h-5" />
            Copy Link
          </button>
          <button
            onClick={() => {
              const shareData = {
                title: 'Pixel Cherry - Compressed Image',
                text: `I compressed my image by ${savingsPercent}% with Pixel Cherry!`,
                url: result.compressedUrl,
              };
              if (navigator.share) {
                navigator.share(shareData);
              } else {
                alert('Sharing not supported on this device');
              }
            }}
            className="flex-1 glass-card hover:bg-white/20 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

// BeforeAfterSlider Component (unchanged)
interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeSize: number;
  afterSize: number;
}

function BeforeAfterSlider({ beforeUrl, afterUrl, beforeSize, afterSize }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleStart = () => setIsDragging(true);
  const handleEnd = () => setIsDragging(false);

  return (
    <div className="glass-card rounded-3xl p-4">
      <div
        ref={containerRef}
        className="relative w-full max-w-4xl mx-auto aspect-video overflow-hidden rounded-2xl select-none cursor-ew-resize"
        onMouseMove={handleMouseMove}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
      >
        {/* After Image (Bottom layer) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterUrl}
          alt="After compression"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          draggable={false}
        />

        {/* Before Image (Top layer with clip) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >   
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={beforeUrl}
            alt="Before compression"
            className="w-full h-full object-contain pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-xl flex items-center justify-center cursor-ew-resize">
            <SlidersHorizontal className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 glass-card px-4 py-2 rounded-xl text-sm font-bold pointer-events-none">
          Before • {(beforeSize / 1024 / 1024).toFixed(2)}MB
        </div>
        <div className="absolute top-4 right-4 glass-card px-4 py-2 rounded-xl text-sm font-bold pointer-events-none">
          After • {(afterSize / 1024).toFixed(0)}KB
        </div>
      </div>
    </div>
  );
}
