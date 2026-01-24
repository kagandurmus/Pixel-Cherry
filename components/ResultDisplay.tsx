'use client';

interface ResultDisplayProps {
  result: {
    compressedUrl: string;
    originalSize: number;
    compressedSize: number;
    facesDetected: number;
  };
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  const savingsPercent = ((1 - result.compressedSize / result.originalSize) * 100).toFixed(1);
  const originalMB = (result.originalSize / 1024 / 1024).toFixed(2);
  const compressedKB = (result.compressedSize / 1024).toFixed(0);

  return (
    <div className="mt-12 glass-effect-strong rounded-3xl p-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="text-5xl animate-bounce">✨</div>
        <h3 className="text-3xl font-black gradient-text">
          Compression Complete!
        </h3>
        <div className="text-5xl animate-bounce" style={{ animationDelay: '0.1s' }}>✨</div>
      </div>
      
      {/* Stats Grid with better design */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Saved', value: `${savingsPercent}%`, color: 'text-green-400', icon: '💾' },
          { label: 'Original', value: `${originalMB}MB`, color: 'text-purple-400', icon: '📦' },
          { label: 'Compressed', value: `${compressedKB}KB`, color: 'text-pink-400', icon: '⚡' },
          { label: 'Faces', value: result.facesDetected, color: 'text-blue-400', icon: '😊' },
        ].map((stat, i) => (
          <div key={i} className="glass-effect rounded-2xl p-6 text-center transform hover:scale-105 transition-all">
            <div className="text-4xl mb-2">{stat.icon}</div>
            <div className={`text-4xl font-black ${stat.color} mb-2`}>
              {stat.value}
            </div>
            <div className="text-gray-300 text-sm font-medium uppercase tracking-wide">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Preview Image with comparison */}
      <div className="mb-8 glass-effect rounded-2xl p-4">
        <img
          src={result.compressedUrl}
          alt="Compressed"
          className="w-full rounded-xl shadow-2xl max-h-[500px] object-contain mx-auto"
        />
      </div>

      {/* Download Button - Super Premium */}
      <a
        href={result.compressedUrl}
        download="compressly-compressed.jpg"
        className="group block w-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 hover:from-green-600 hover:via-emerald-600 hover:to-green-600 text-white text-center px-10 py-6 rounded-2xl font-black text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 bg-[length:200%_auto] hover:bg-right"
      >
        <span className="flex items-center justify-center gap-3">
          <span className="text-2xl">⬇️</span>
          Download Compressed Image
          <span className="text-2xl group-hover:animate-bounce">🎉</span>
        </span>
      </a>
    </div>
  );
}
