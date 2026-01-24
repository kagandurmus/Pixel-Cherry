'use client';

interface PlatformSelectorProps {
  selected: 'instagram' | 'linkedin' | 'tiktok';
  onSelect: (platform: 'instagram' | 'linkedin' | 'tiktok') => void;
}

export default function PlatformSelector({ selected, onSelect }: PlatformSelectorProps) {
  const platforms = [
    {
      id: 'instagram' as const,
      name: 'Instagram',
      icon: '📷',
      gradient: 'from-purple-500 via-pink-500 to-orange-400',
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
      icon: '💼',
      gradient: 'from-blue-500 to-blue-600',
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
      icon: '🎵',
      gradient: 'from-pink-500 to-cyan-400',
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
      {platforms.map((platform) => (
        <button
          key={platform.id}
          onClick={() => onSelect(platform.id)}
          className={`
            relative glass-card p-6 rounded-3xl text-left transition-all duration-300 transform hover:scale-105
            ${selected === platform.id ? 'ring-2 ring-purple-500 shadow-2xl scale-105' : ''}
          `}
        >
          {/* Selection indicator */}
          {selected === platform.id && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}

          {/* Platform icon */}
          <div className={`w-16 h-16 bg-gradient-to-r ${platform.gradient} rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg`}>
            {platform.icon}
          </div>

          {/* Platform info */}
          <h3 className="text-2xl font-bold mb-2">{platform.name}</h3>
          <p className="text-sm opacity-70 mb-4">{platform.description}</p>

          {/* Specs */}
          <div className="space-y-2 text-xs">
            {Object.entries(platform.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between opacity-70">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="font-mono font-bold">{value}</span>
              </div>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
}
