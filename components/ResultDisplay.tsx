'use client';

import { useState } from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';

interface ResultDisplayProps {
  result: {
    compressedUrl: string;
    originalSize: number;
    compressedSize: number;
    facesDetected: number;
  };
  originalUrl?: string;
}

export default function ResultDisplay({ result, originalUrl }: ResultDisplayProps) {
  const [activeTab, setActiveTab] = useState<'comparison' | 'stats'>('comparison');
  const savingsPercent = ((1 - result.compressedSize / result.originalSize) * 100).toFixed(1);
  const originalMB = (result.originalSize / 1024 / 1024).toFixed(2);
  const compressedKB = (result.compressedSize / 1024).toFixed(0);

  return (
    <div className="mt-12 space-y-6 animate-in fade-in duration-500">
      {/* Success header */}
      <div className="glass-card rounded-3xl p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="text-5xl animate-bounce">🎉</div>
          <h3 className="text-4xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-gradient-x">
            Compression Complete!
          </h3>
          <div className="text-5xl animate-bounce" style={{ animationDelay: '0.1s' }}>✨</div>
        </div>
        <p className="text-lg opacity-70">
          Reduced by <span className="font-bold text-green-400">{savingsPercent}%</span> while preserving quality
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
            activeTab === 'comparison'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
              : 'glass-card hover:scale-105'
          }`}
        >
          <span className="flex items-center gap-2">
            <span>🔍</span>
            Before/After
          </span>
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
            activeTab === 'stats'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
              : 'glass-card hover:scale-105'
          }`}
        >
          <span className="flex items-center gap-2">
            <span>📊</span>
            Statistics
          </span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'comparison' && originalUrl ? (
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
              { label: 'Saved', value: `${savingsPercent}%`, color: 'text-green-400', icon: '💾', bg: 'from-green-500/20 to-emerald-500/20' },
              { label: 'Original', value: `${originalMB}MB`, color: 'text-purple-400', icon: '📦', bg: 'from-purple-500/20 to-purple-600/20' },
              { label: 'Compressed', value: `${compressedKB}KB`, color: 'text-pink-400', icon: '⚡', bg: 'from-pink-500/20 to-pink-600/20' },
              { label: 'Faces', value: result.facesDetected, color: 'text-blue-400', icon: '😊', bg: 'from-blue-500/20 to-blue-600/20' },
            ].map((stat, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 text-center transform hover:scale-105 transition-all relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-50`} />
                <div className="relative z-10">
                  <div className="text-4xl mb-3 transform hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div className={`text-4xl font-black ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm opacity-70 font-medium uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Preview Image */}
          <div className="glass-card rounded-3xl p-4">
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
          download={`compressly-${Date.now()}.jpg`}
          className="group block w-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 hover:from-green-600 hover:via-emerald-600 hover:to-green-600 text-white text-center px-10 py-6 rounded-2xl font-black text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 bg-[length:200%_auto] hover:bg-right"
        >
          <span className="flex items-center justify-center gap-3">
            <span className="text-3xl">⬇️</span>
            Download Compressed Image
            <span className="text-3xl group-hover:animate-bounce">🎉</span>
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
            <span>🔗</span>
            Copy Link
          </button>
          <button
            onClick={() => {
              const shareData = {
                title: 'Compressly - Compressed Image',
                text: `I compressed my image by ${savingsPercent}% with Compressly!`,
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
            <span>📤</span>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
