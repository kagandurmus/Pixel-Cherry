'use client';

import { useState } from 'react';
import { useTheme } from './providers';
import ImageUploader from '@/components/ImageUploader';
import PlatformSelector from '@/components/PlatformSelector';
import ResultDisplay from '@/components/ResultDisplay';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [platform, setPlatform] = useState<'instagram' | 'linkedin' | 'tiktok'>('instagram');
  const [result, setResult] = useState<{
    compressedUrl: string;
    originalSize: number;
    compressedSize: number;
    facesDetected: number;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setResult(null);
  };

  const handleCompress = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    
    const { compressImage } = await import('@/lib/imageCompression');
    
    try {
      const compressed = await compressImage(selectedFile, platform);
      setResult(compressed);
    } catch (error) {
      console.error('Compression failed:', error);
      alert('Compression failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: theme === 'dark' ? 'linear-gradient(to bottom right, #0f0c29, #302b63, #24243e)' : 'linear-gradient(to bottom right, #f8f9fa, #e9ecef, #dee2e6)' }}>
      {/* Floating background orbs */}
      {theme === 'dark' && (
        <>
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        </>
      )}

      {/* Header */}
      <header className="relative z-20 container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
            ✨
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Compressly
            </h1>
            <p className="text-xs opacity-70">AI-Powered Compression</p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="w-12 h-12 glass-card rounded-xl flex items-center justify-center hover:scale-110 transition-transform text-xl"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {!showUploader ? (
          // Hero Landing Page
          <div className="max-w-4xl mx-auto text-center space-y-12 py-12">
            <div className="space-y-6">
              <h2 className="text-6xl md:text-7xl font-black leading-tight">
                Compress{' '}
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-gradient-x">
                  smarter
                </span>
                ,<br />
                not harder
              </h2>
              
              <p className="text-xl md:text-2xl opacity-80 max-w-3xl mx-auto leading-relaxed">
                AI-powered face-aware compression optimized for{' '}
                <span className="font-bold text-purple-500">Instagram</span>,{' '}
                <span className="font-bold text-blue-500">LinkedIn</span> &{' '}
                <span className="font-bold text-pink-500">TikTok</span>
              </p>
              
              <p className="text-lg opacity-60">
                Your photos, your device, 100% free.
              </p>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { icon: '🎯', label: 'Platform-Specific' },
                { icon: '🤖', label: 'AI Face Detection' },
                { icon: '🔒', label: 'Privacy-First' },
                { icon: '⚡', label: 'Batch Processing' },
                { icon: '📦', label: '50-70% Smaller' },
                { icon: '🎁', label: 'Free Forever' },
              ].map((badge) => (
                <span key={badge.label} className="feature-badge">
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </span>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setShowUploader(true)}
              className="btn-primary text-lg px-12 py-5 inline-flex items-center gap-2 animate-pulse-glow"
            >
              Start Compressing
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12">
              {[
                { value: '50-70%', label: 'File Size Reduction' },
                { value: '95%+', label: 'Face Detection Accuracy' },
                { value: '0', label: 'Data Sent to Servers' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm opacity-60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Main Compression Interface
          <div className="space-y-8">
            <button
              onClick={() => setShowUploader(false)}
              className="glass-card px-4 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <div className="max-w-6xl mx-auto">
              <PlatformSelector selected={platform} onSelect={setPlatform} />
              
              <div className="mt-8">
                <ImageUploader onFileSelect={handleFileSelect} />
              </div>

              {selectedFile && (
                <div className="mt-8 text-center space-y-4">
                  <div className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">
                      {selectedFile.name} • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>

                  <button
                    onClick={handleCompress}
                    disabled={isProcessing}
                    className="btn-primary text-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-3">
                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `✨ Compress for ${platform.charAt(0).toUpperCase() + platform.slice(1)}`
                    )}
                  </button>
                </div>
              )}

              {result && <ResultDisplay result={result} />}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 opacity-60 text-sm">
        Built with Next.js 14 & TypeScript
      </footer>
    </div>
  );
}
