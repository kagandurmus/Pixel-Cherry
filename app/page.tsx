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
    
    try {
      const { compressImage } = await import('@/lib/imageCompression');
      const compressed = await compressImage(selectedFile);
      
      const resultData = {
        ...compressed,
        originalUrl,
        facesDetected: 0
      } as typeof result;
      
      setResult(resultData);
    } catch (error) {
      console.error('❌ Compression failed:', error);
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
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
      <header className="relative z-20 container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg">
            <Image 
              src="/logo.png" 
              alt="Pixel Cherry Logo" 
              width={40} 
              height={40}
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-rose-500 bg-clip-text text-transparent">
              Pixel Cherry
            </h1>
            <p className="text-xs opacity-70">Fast • Client-Side • Private</p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="w-10 h-10 glass-card rounded-xl flex items-center justify-center hover:scale-110 transition-transform text-lg"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-4 max-w-5xl">
        {/* Hero Title - COMPACT */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-2xl md:text-3xl font-black leading-tight">
            Compress Images{' '}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-600 to-rose-500 bg-clip-text text-transparent">
              Without Losing Quality
            </span>
          </h2>

          <p className="text-sm md:text-base opacity-70">
            Smart compression that prioritizes quality.
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-2 justify-center pt-1">
            {[
              { icon: Sparkles, label: 'High Quality', color: 'text-rose-500' },
              { icon: Lock, label: '100% Private', color: 'text-teal-500' },
              { icon: UserX, label: 'No Signup', color: 'text-red-500' },
            ].map((badge) => (
              <span key={badge.label} className="feature-badge text-xs px-2 py-1">
                <badge.icon className={`w-3 h-3 ${badge.color}`} />
                <span>{badge.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Main Workflow */}
        <div className="max-w-4xl mx-auto">
          {/* Upload */}
          <div>
            <h3 className="text-base font-bold mb-2">Upload Your Image</h3>
            <ImageUploader onFileSelect={handleFileSelect} />
          </div>

          {/* Compress */}
          {selectedFile && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-base font-bold mb-2">Compress & Download</h3>
              
              <div className="glass-card rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-sm">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="font-medium truncate">
                    {selectedFile.name} • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>

                <button
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="w-full btn-primary text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Compressing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Compress Image
                    </span>
                  )}
                </button>

                <p className="text-center text-xs opacity-60">Up to 60% smaller</p>
              </div>
            </div>
          )}

          {/* Results */}
          {result && <ResultDisplay result={result} originalUrl={result.originalUrl} />}
        </div>

        {/* Educational Content */}
        <div className="max-w-4xl mx-auto mt-16 space-y-12">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">Why compress your images?</h3>
              <p className="text-base opacity-80">Make your photos easier to share and store</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="glass-card p-5 rounded-2xl space-y-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h4 className="text-lg font-bold">Share Instantly</h4>
                <p className="text-sm opacity-80 leading-relaxed">
                  Upload to email, WhatsApp, or cloud storage 3x faster.
                </p>
              </div>

              <div className="glass-card p-5 rounded-2xl space-y-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h4 className="text-lg font-bold">Save Space</h4>
                <p className="text-sm opacity-80 leading-relaxed">
                  Free up 40-60% of storage without deleting photos.
                </p>
              </div>

              <div className="glass-card p-5 rounded-2xl space-y-2">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h4 className="text-lg font-bold">Keep Quality</h4>
                <p className="text-sm opacity-80 leading-relaxed">
                  Smart compression preserves sharpness and colors.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-8">
            {[
              { value: '40-60%', label: 'Smaller', Icon: TrendingDown, color: 'from-emerald-600 to-teal-500' },
              { value: '100%', label: 'Quality', Icon: Sparkles, color: 'from-rose-500 to-pink-500' },
              { value: '0', label: 'Uploads', Icon: CloudOff, color: 'from-blue-500 to-indigo-500' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1.5">
                <stat.Icon className={`w-7 h-7 mx-auto text-transparent bg-gradient-to-r ${stat.color} bg-clip-text`} strokeWidth={2} />
                <div className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-xs opacity-60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 opacity-60 text-sm space-y-3 mt-16">
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
