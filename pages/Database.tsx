
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Sparkles, LayoutGrid, List, Plus, AlertCircle, CheckCircle, Edit2, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { TrackCard } from '../components/TrackCard';
import { Language, ProjectType } from '../types';

export const Database: React.FC = () => {
  const { tracks, isLoading, deleteTrack } = useData();
  
  // View Mode: 'grid' (Gallery) or 'list' (Excel-like)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Local Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language | 'All'>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectType | 'All'>('All');
  const [onlyEditorsPick, setOnlyEditorsPick] = useState(false);

  // Filter Logic
  const filteredTracks = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    return tracks.filter(track => {
      // 增強搜尋邏輯：同時比對 歌名、ISRC、UPC 以及 版本標記
      const matchesSearch = 
        track.title.toLowerCase().includes(query) ||
        track.isrc.toLowerCase().includes(query) ||
        track.upc.toLowerCase().includes(query) ||
        (track.versionLabel && track.versionLabel.toLowerCase().includes(query));
      
      const matchesLang = selectedLang === 'All' || track.languages.includes(selectedLang);
      const matchesProject = selectedProject === 'All' || track.project === selectedProject;
      const matchesPick = !onlyEditorsPick || track.isEditorsPick;

      return matchesSearch && matchesLang && matchesProject && matchesPick;
    });
  }, [tracks, searchQuery, selectedLang, selectedProject, onlyEditorsPick]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-willwi-primary"></div>
      </div>
    );
  }

  // Helper to check data integrity
  const checkIntegrity = (track: any) => {
    const missing = [];
    if (!track.isrc) missing.push('ISRC');
    if (!track.lyrics) missing.push('歌詞');
    if (!track.coverImage || track.coverImage.includes('picsum')) missing.push('封面');
    if (!track.spotifyId) missing.push('Spotify');
    
    return missing;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white mb-2">音樂作品資料庫管理</h1>
           <p className="text-gray-400">總覽所有作品狀態，快速找出缺漏資料。</p>
        </div>
        <div className="flex items-center gap-4">
           <Link to="/add" className="hidden md:flex items-center gap-2 bg-willwi-primary hover:bg-willwi-primary/90 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-willwi-primary/20">
              <Plus size={18} /> 新增作品
           </Link>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-willwi-surface rounded-xl p-4 mb-8 border border-white/5 sticky top-20 z-30 shadow-2xl shadow-black/50 backdrop-blur-xl bg-willwi-surface/90">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Search */}
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="搜尋 歌名, 版本, ISRC, UPC..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-willwi-dark border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-willwi-primary transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row gap-3 items-center">
             <select 
               value={selectedLang} 
               onChange={(e) => setSelectedLang(e.target.value as Language | 'All')}
               className="w-full sm:w-auto bg-willwi-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-willwi-primary"
             >
               <option value="All">所有語言</option>
               {Object.values(Language).map(l => <option key={l} value={l}>{l}</option>)}
             </select>

             <select 
               value={selectedProject} 
               onChange={(e) => setSelectedProject(e.target.value as ProjectType | 'All')}
               className="w-full sm:w-auto bg-willwi-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-willwi-primary"
             >
               <option value="All">所有專案</option>
               {Object.values(ProjectType).map(p => <option key={p} value={p}>{p}</option>)}
             </select>
          </div>

          {/* View Toggle */}
          <div className="lg:col-span-2 flex justify-end gap-2 border-l border-white/10 pl-4">
             <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                title="清單列表 (管理模式)"
             >
                <List size={20} />
             </button>
             <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                title="卡片預覽 (展示模式)"
             >
                <LayoutGrid size={20} />
             </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {filteredTracks.length > 0 ? (
        viewMode === 'grid' ? (
          // GRID VIEW
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTracks.map(track => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        ) : (
          // LIST VIEW (EXCEL LIKE)
          <div className="bg-willwi-surface rounded-xl border border-white/5 overflow-hidden overflow-x-auto">
             <table className="w-full text-left text-sm text-gray-400">
               <thead className="bg-white/5 text-gray-200 uppercase font-bold text-xs">
                 <tr>
                   <th className="px-6 py-4">歌名 / 版本</th>
                   <th className="px-6 py-4">語言</th>
                   <th className="px-6 py-4">ISRC / 發行日</th>
                   <th className="px-6 py-4">資料完整度</th>
                   <th className="px-6 py-4 text-right">操作</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {filteredTracks.map(track => {
                    const missing = checkIntegrity(track);
                    return (
                      <tr key={track.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <img src={track.coverImage} className="w-10 h-10 rounded object-cover bg-gray-800" alt="" />
                             <div>
                               <div className="font-bold text-white text-base">{track.title}</div>
                               <div className="text-xs text-willwi-primary border border-willwi-primary/30 rounded px-1.5 inline-block mt-1">
                                 {track.versionLabel || '原版'}
                               </div>
                               {track.isEditorsPick && <span className="ml-2 text-xs text-yellow-500">★ 精選</span>}
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                             {track.languages.map(l => <span key={l} className="px-2 py-0.5 bg-black/20 rounded text-xs">{l}</span>)}
                          </div>
                          <div className="mt-1 text-xs opacity-50">{track.project}</div>
                        </td>
                        <td className="px-6 py-4 font-mono">
                          <div className="text-white">{track.isrc}</div>
                          <div className="text-xs opacity-50">{track.releaseDate}</div>
                        </td>
                        <td className="px-6 py-4">
                           {missing.length === 0 ? (
                             <span className="flex items-center gap-1 text-green-400 text-xs">
                               <CheckCircle size={14} /> 資料完整
                             </span>
                           ) : (
                             <div className="flex items-start gap-1 text-red-400 text-xs">
                               <AlertCircle size={14} className="shrink-0 mt-0.5" /> 
                               <span>缺: {missing.join(', ')}</span>
                             </div>
                           )}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link to={`/track/${track.id}`} className="p-2 bg-willwi-primary/10 text-willwi-primary rounded hover:bg-willwi-primary hover:text-white transition-colors" title="編輯/詳情">
                                 <Edit2 size={16} />
                              </Link>
                              <button onClick={() => deleteTrack(track.id)} className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors" title="刪除">
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    );
                 })}
               </tbody>
             </table>
          </div>
        )
      ) : (
        <div className="text-center py-20 bg-willwi-surface/30 rounded-xl border border-dashed border-white/10">
          <Filter className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-white">找不到相符的歌曲</h3>
          <p className="text-gray-500 mb-6">請嘗試調整您的篩選條件，或直接新增一首。</p>
          <Link to="/add" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full transition-colors">
             <Plus size={18} /> 新增作品
          </Link>
        </div>
      )}
    </div>
  );
};
