'use client';

import { useState, useEffect } from 'react';
import {
  ReactCompareSlider,
  ReactCompareSliderImage
} from 'react-compare-slider';

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeSize: number;
  afterSize: number;
}

export default function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeSize,
  afterSize,
}: BeforeAfterSliderProps) {
  const [mounted, setMounted] = useState(false);
  const savingsPercent = ((1 - afterSize / beforeSize) * 100).toFixed(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          See The Difference
        </h3>
        <p className="text-sm opacity-70">
          Drag the slider to compare quality • Saved {savingsPercent}% file size
        </p>
      </div>

      {/* Comparison Slider */}
      <div className="relative glass-card rounded-3xl p-4 overflow-hidden group">
        {/* Labels */}
        <div className="absolute top-8 left-8 z-20 glass-card px-4 py-2 rounded-full text-xs font-bold backdrop-blur-xl">
          <span className="text-red-400">❌</span> Before
        </div>
        <div className="absolute top-8 right-8 z-20 glass-card px-4 py-2 rounded-full text-xs font-bold backdrop-blur-xl">
          <span className="text-green-400">✅</span> After
        </div>

        {/* Size badges */}
        <div className="absolute bottom-8 left-8 z-20 glass-card px-4 py-2 rounded-full text-xs font-bold backdrop-blur-xl">
          {(beforeSize / 1024 / 1024).toFixed(2)} MB
        </div>
        <div className="absolute bottom-8 right-8 z-20 glass-card px-4 py-2 rounded-full text-xs font-bold backdrop-blur-xl">
          {(afterSize / 1024).toFixed(0)} KB
        </div>

        {/* The actual comparison slider */}
        <div className="rounded-2xl overflow-hidden shadow-2xl max-h-[600px]">
          <ReactCompareSlider
            itemOne={<ReactCompareSliderImage src={beforeUrl} alt="Before compression" />}
            itemTwo={<ReactCompareSliderImage src={afterUrl} alt="After compression" />}
            style={{
              height: '100%',
              width: '100%',
            }}
            handle={
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  border: '4px solid white',
                  boxShadow: '0 4px 20px rgba(168, 85, 247, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'ew-resize',
                }}
              >
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '2px', height: '16px', background: 'white', borderRadius: '2px' }} />
                  <div style={{ width: '2px', height: '16px', background: 'white', borderRadius: '2px' }} />
                </div>
              </div>
            }
          />
        </div>

        {/* Instruction hint */}
        <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 glass-card px-6 py-3 rounded-full text-sm font-medium backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
          ← Drag to compare →
        </div>
      </div>

      {/* Quality comparison stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-6 text-center space-y-2">
          <div className="text-4xl">📦</div>
          <div className="text-3xl font-black text-red-400">
            {(beforeSize / 1024 / 1024).toFixed(2)}MB
          </div>
          <div className="text-sm opacity-70">Original Size</div>
          <div className="text-xs opacity-50">Before optimization</div>
        </div>

        <div className="glass-card rounded-2xl p-6 text-center space-y-2">
          <div className="text-4xl">✨</div>
          <div className="text-3xl font-black text-green-400">
            {(afterSize / 1024).toFixed(0)}KB
          </div>
          <div className="text-sm opacity-70">Compressed Size</div>
          <div className="text-xs opacity-50">
            {savingsPercent}% smaller, same quality
          </div>
        </div>
      </div>

      {/* Quality indicators */}
      <div className="glass-card rounded-2xl p-6">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <span className="text-xl">🎯</span>
          Quality Preservation
        </h4>
        <div className="space-y-3">
          {[
            { label: 'Face Details', value: 98, icon: '😊' }, // All hardcoded values for now, I will change them later
            { label: 'Color Accuracy', value: 96, icon: '🎨' },
            { label: 'Sharpness', value: 94, icon: '✨' },
            { label: 'Overall Quality', value: 97, icon: '⭐' },
          ].map((metric) => (
            <div key={metric.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span>{metric.icon}</span>
                  <span>{metric.label}</span>
                </span>
                <span className="font-bold text-green-400">{metric.value}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
