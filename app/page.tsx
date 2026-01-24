'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTheme } from './providers';
import ImageUploader from '@/components/ImageUploader';
import PlatformSelector from '@/components/PlatformSelector';
import ResultDisplay from '@/components/ResultDisplay';
import { 
  Target, 
  Brain, 
  Lock, 
  Shield, 
  UserX, 
  Zap,
  TrendingDown,
  Cookie,
  CloudOff,
  Camera
} from 'lucide-react';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [platform, setPlatform] = useState<'instagram' | 'linkedin' | 'tiktok'>('instagram');
  const [result, setResult] = useState<{
    compressedUrl: string;
    originalSize: number;
    compressedSize: number;
    facesDetected: number;
    originalUrl?: string;
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
    
    // Create URL for original image (for comparison slider)
    const originalUrl = URL.createObjectURL(selectedFile);
    
    const { compressImage } = await import('@/lib/imageCompression');
    
    try {
      const compressed = await compressImage(selectedFile, platform);
      setResult({ ...compressed, originalUrl });
    } catch (error) {
      console.error('Compression failed:', error);
      alert('Compression failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: theme === 'dark' ? 'linear-gradient(to bottom right, #1a1414, #2D5F4F, #1a1a1a)' : 'linear-gradient(to bottom right, #FFF5EE, #f0f9ff, #e8f5e9)' }}>
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
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg">
              <Image 
                src="/logo.png" 
                alt="Pixel Cherry Logo" 
                width={48} 
                height={48}
                className="object-cover"
              />
            </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Pixel Cherry
            </h1>
            <p className="text-xs opacity-70">ML-Powered • Client-Side • Private</p>
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
                Optimize your Images
                <br />
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-gradient-x">
                  for every platform
                </span>
                <br />
                in one click
              </h2>
              
              <p className="text-xl md:text-2xl opacity-80 max-w-3xl mx-auto leading-relaxed">
                Machine learning-powered compression optimized for{' '}
                <span className="font-bold text-purple-500">Instagram</span>,{' '}
                <span className="font-bold text-blue-500">LinkedIn</span> &{' '}
                <span className="font-bold text-pink-500">TikTok</span>
              </p>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { icon: Target, label: 'Platform-Optimized', color: 'text-purple-400' },
                { icon: Brain, label: 'ML Face Detection', color: 'text-pink-400' },
                { icon: Lock, label: '100% Client-Side', color: 'text-green-400' },
                { icon: Shield, label: 'No Tracking', color: 'text-blue-400' },
                { icon: UserX, label: 'No Login Required', color: 'text-orange-400' },
                { icon: Zap, label: 'Always Free', color: 'text-emerald-400' },
              ].map((badge) => (
                <span key={badge.label} className="feature-badge">
                  <badge.icon className={`w-4 h-4 ${badge.color}`} />
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
                { value: '50-70%', label: 'File Size Reduction', Icon: TrendingDown, color: 'from-purple-500 to-pink-500' },
                { value: '0', label: 'Tracking & Cookies', Icon: Cookie, color: 'from-green-500 to-emerald-500' },
                { value: '0', label: 'Server Uploads', Icon: CloudOff, color: 'from-blue-500 to-cyan-500' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <stat.Icon className={`w-8 h-8 mx-auto text-transparent bg-gradient-to-r ${stat.color} bg-clip-text`} strokeWidth={2} />
                  <div className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
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

              {result && <ResultDisplay result={result} originalUrl={result.originalUrl} />}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 opacity-60 text-sm space-y-3">
        <p className="font-medium">Built with Next.js 14, TypeScript & MediaPipe ML</p>
        <div className="flex items-center justify-center gap-4 flex-wrap text-xs">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Client-side only
          </span>
          <span className="opacity-40">•</span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            No tracking
          </span>
          <span className="opacity-40">•</span>
          <span className="flex items-center gap-1.5">
            <UserX className="w-3.5 h-3.5" />
            No login
          </span>
          <span className="opacity-40">•</span>
          <span className="flex items-center gap-1.5">
            <CloudOff className="w-3.5 h-3.5" />
            No uploads
          </span>
          <span className="opacity-40">•</span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Always free
          </span>
        </div>
      </footer>
    </div>
  );
}
