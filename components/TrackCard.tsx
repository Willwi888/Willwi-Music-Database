
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, Globe } from 'lucide-react';
import { Track, ProjectType } from '../types';

interface TrackCardProps {
  track: Track;
}

export const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
  return (
    <Link to={`/track/${track.id}`} className="group relative block bg-willwi-surface rounded-xl overflow-hidden border border-white/5 hover:border-willwi-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-willwi-primary/10">
      
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={track.coverImage} 
          alt={track.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-full bg-willwi-primary text-white flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
            <Play size={20} fill="currentColor" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {track.isEditorsPick && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-md">
              <Sparkles size={10} /> 編輯精選
            </span>
          )}
           {track.project === ProjectType.INSTANT_NOODLE && (
            <span className="inline-flex items-center px-2 py-1 bg-willwi-accent/90 text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-md">
              泡麵聲學院
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-bold text-lg truncate group-hover:text-willwi-primary transition-colors">
          {track.title}
        </h3>
        <p className="text-gray-400 text-sm truncate mb-3">{track.artist}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-3">
          <div className="flex items-center gap-1.5">
            <Globe size={12} />
            <span className="truncate max-w-[100px]">{track.languages[0]}</span>
            {track.languages.length > 1 && <span className="text-gray-600">+{track.languages.length - 1}</span>}
          </div>
          <span>{track.releaseDate.split('-')[0]}</span>
        </div>
      </div>
    </Link>
  );
};
