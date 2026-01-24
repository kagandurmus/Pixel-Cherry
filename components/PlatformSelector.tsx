'use client';

import { Instagram, Linkedin, Music, Sparkles, Check } from 'lucide-react';

interface PlatformSelectorProps {
  selected: 'instagram' | 'linkedin' | 'tiktok';
  onSelect: (platform: 'instagram' | 'linkedin' | 'tiktok') => void;
}

export default function PlatformSelector({ selected, onSelect }: PlatformSelectorProps) {
  const platforms = [
    {
      id: 'instagram' as const,
      name: 'Instagram',
      Icon: Instagram,
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      ringColor: 'ring-pink-500',
      glowColor: 'shadow-pink-500/50',
      iconBg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500',
      description: 'Optimized for feed posts & stories',
      specs: {
        maxSize: '1440×1800',
        quality: '92%',
        sharpening: '+12%',
        saturation: '+8%',
      },
    },
    {
      id: 'linkedin' as const,
      name: 'LinkedIn',
      Icon: Linkedin,
      gradient: 'from-blue-600 to-blue-700',
      ringColor: 'ring-blue-500',
      glowColor: 'shadow-blue-500/50',
      iconBg: 'bg-gradient-to-br from-blue-600 to-blue-500',
      description: 'Professional quality for business posts',
      specs: {
        maxSize: '1200×1200',
        quality: '90%',
        sharpening: '+5%',
        saturation: '+2%',
      },
    },
    {
      id: 'tiktok' as const,
      name: 'TikTok',
      Icon: Music,
      gradient: 'from-emerald-500 to-teal-600',
      ringColor: 'ring-emerald-500',
      glowColor: 'shadow-emerald-500/50',
      iconBg: 'bg-gradient-to-br from-emerald-600 to-teal-500',
      description: 'Vibrant colors for video thumbnails',
      specs: {
        maxSize: '1080×1920',
        quality: '89%',
        sharpening: '+10%',
        saturation: '+5%',
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {platforms.map((platform) => {
        const { Icon } = platform;
        const isSelected = selected === platform.id;
        
        return (
          <button
            key={platform.id}
            onClick={() => onSelect(platform.id)}
            className={`
              relative glass-card p-6 rounded-3xl text-left transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
              ${isSelected ? `ring-2 ${platform.ringColor} shadow-2xl ${platform.glowColor} scale-105` : 'hover:ring-1 hover:ring-white/20'}
            `}
          >
            {/* Selection indicator with checkmark */}
            {isSelected && (
              <div className={`absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r ${platform.gradient} rounded-full flex items-center justify-center shadow-lg ${platform.glowColor} animate-pulse`}>
                <Check className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
            )}

            {/* Sparkle effect for selected */}
            {isSelected && (
              <div className="absolute -top-1 -left-1">
                <Sparkles className={`w-5 h-5 text-${platform.ringColor.replace('ring-', '')} animate-pulse`} />
              </div>
            )}

            {/* Platform icon with proper Lucide icons */}
            <div className={`w-16 h-16 ${platform.iconBg} rounded-2xl flex items-center justify-center mb-4 shadow-lg ${isSelected ? platform.glowColor : ''} transition-all duration-300`}>
              <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>

            {/* Platform info */}
            <h3 className={`text-2xl font-bold mb-2 ${isSelected ? `bg-gradient-to-r ${platform.gradient} bg-clip-text text-transparent` : ''}`}>
              {platform.name}
            </h3>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">{platform.description}</p>

            {/* Specs with improved styling */}
            <div className="space-y-2.5 text-xs">
              {Object.entries(platform.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity">
                  <span className="capitalize text-xs font-medium">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`font-mono font-bold text-sm ${isSelected ? `text-${platform.ringColor.replace('ring-', '')}` : ''}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom accent line */}
            {isSelected && (
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${platform.gradient} rounded-b-3xl`} />
            )}
          </button>
        );
      })}
    </div>
  );
}
