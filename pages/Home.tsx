
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { useData } from '../context/DataContext';
import { TrackCard } from '../components/TrackCard';

export const Home: React.FC = () => {
  const { tracks } = useData();
  const featuredTracks = tracks.filter(t => t.isEditorsPick).slice(0, 3);

  return (
    <div className="pb-20">
      {/* Hero */}
      <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Animation (Simulated with CSS) */}
        <div className="absolute inset-0 bg-willwi-dark">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-willwi-primary/20 rounded-full blur-[128px] animate-pulse"></div>
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-willwi-accent/20 rounded-full blur-[128px]" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm text-gray-300 mb-6">
             🎧 全球串流平台熱播中
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Willwi <span className="text-transparent bg-clip-text bg-gradient-to-r from-willwi-primary to-willwi-accent">Music</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            一場結構化的聲音之旅。多語系獨立流行音樂，與實驗性的「泡麵聲學院」計畫。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link to="/database" className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2">
               瀏覽資料庫 <ArrowRight size={18} />
             </Link>
             <a href="https://open.spotify.com/artist/3ascZ8Rb2KDw4QyCy29Om4" target="_blank" rel="noreferrer" className="px-8 py-3 bg-[#1DB954] text-white font-bold rounded-full hover:bg-[#1ed760] transition-colors">
               在 Spotify 上收聽
             </a>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <Star className="text-yellow-500" fill="currentColor" /> 編輯精選
           </h2>
           <Link to="/database" className="text-sm text-willwi-primary hover:text-white transition-colors">查看全部</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {featuredTracks.map(track => (
             <TrackCard key={track.id} track={track} />
           ))}
        </div>
      </div>
    </div>
  );
};
