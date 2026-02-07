'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTheme } from './providers';
import ImageUploader from '@/components/ImageUploader';
import ResultDisplay from '@/components/ResultDisplay';
import { 
  Lock, 
  Shield, 
  UserX, 
  Zap,
  TrendingDown,
  CloudOff,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<{
    compressedUrl: string;
    originalSize: number;
    compressedSize: number;
    facesDetected: number;
    originalUrl?: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setResult(null);
  };

  const handleCompress = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    const originalUrl = URL.createObjectURL(selectedFile);
    
    const { compressImage } = await import('@/lib/imageCompression');
    
    try {
      const compressed = await compressImage(selectedFile);
      
      // TypeScript-happy Version:
      const resultData = {
        ...compressed,
        originalUrl,
        facesDetected: 0 // Für deine UI-Kompatibilität
      } as typeof result;
      
      setResult(resultData);
    } catch (error) {
      console.error('Compression failed:', error);
      alert('Compression failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: theme === 'dark' ? 'linear-gradient(to bottom right, #0a0a0a, #1a1a1a, #0f0f0f)' : 'linear-gradient(to bottom right, #FFF5EE, #f0f9ff, #e8f5e9)' }}>
      {/* Floating background orbs */}
      {theme === 'dark' && (
    <>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gray-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-rose-500 bg-clip-text text-transparent">
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
        {/* Hero Title */}
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-12">
          <h2 className="text-5xl md:text-6xl font-black leading-tight">
            Compress Images
            <br />
            <span className="bg-gradient-to-r from-emerald-500 via-teal-600 to-rose-500 bg-clip-text text-transparent animate-gradient-x">
              Without Losing Quality
            </span>
          </h2>

          <p className="text-lg md:text-xl opacity-80 max-w-3xl mx-auto leading-relaxed">
            Smart compression that prioritizes quality.
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            {[
              { icon: Sparkles, label: 'High Quality', color: 'text-rose-500' },
              { icon: Lock, label: '100% Private', color: 'text-teal-500' },
              { icon: UserX, label: 'No Signup', color: 'text-red-500' },
            ].map((badge) => (
              <span key={badge.label} className="feature-badge">
                <badge.icon className={`w-4 h-4 ${badge.color}`} />
                <span>{badge.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Main Compression Workflow */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Step 1: Upload Image */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-bold">Upload Your Image</h3>
            </div>
            <ImageUploader onFileSelect={handleFileSelect} />
          </div>

          {/* Step 2: Compress (shows when file selected) */}
          {selectedFile && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold">Compress & Download</h3>
              </div>
              
              <div className="glass-card rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-emerald-500/10">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">
                    {selectedFile.name} • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>

                <button
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="w-full btn-primary text-xl py-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Compressing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <Sparkles className="w-6 h-6" />
                      Compress Image (High Quality)
                      <Sparkles className="w-6 h-6" />
                    </span>
                  )}
                </button>

                {/* Quality guarantee badge */}
                <div className="text-center text-xs opacity-70 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Automatic high-quality compression • Up to 60% smaller</span>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {result && <ResultDisplay result={result} originalUrl={result.originalUrl} />}
        </div>


        {/* Educational Content Below */}
        <div className="max-w-4xl mx-auto mt-24 space-y-16">

          {/* Educational Section */}
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h3 className="text-3xl font-bold">Why compress your images?</h3>
              <p className="text-lg opacity-80">Make your photos easier to share and store—without sacrificing quality</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-2xl space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <h4 className="text-xl font-bold">Share Instantly</h4>
                <p className="text-sm opacity-80 leading-relaxed">
                  Upload to email, WhatsApp, or cloud storage 3x faster. No more "file too large" errors.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <h4 className="text-xl font-bold">Save Space</h4>
                <p className="text-sm opacity-80 leading-relaxed">
                  Free up 40-60% of storage on your phone or computer without deleting any photos.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <h4 className="text-xl font-bold">Keep Quality</h4>
                <p className="text-sm opacity-80 leading-relaxed">
                  Smart compression preserves sharpness and colors. Your images still look great.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12">
            {[
              { value: '40-60%', label: 'File Size Reduction', Icon: TrendingDown, color: 'from-emerald-600 to-teal-500' },
              { value: '100%', label: 'Quality Preserved', Icon: Sparkles, color: 'from-rose-500 to-pink-500' },
              { value: '0', label: 'Server Uploads', Icon: CloudOff, color: 'from-blue-500 to-indigo-500' },
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
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 opacity-60 text-sm space-y-3 mt-24">
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
