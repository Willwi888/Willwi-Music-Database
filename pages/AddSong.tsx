
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Track, Language, ProjectType } from '../types';
import { usePrompt } from '../hooks/usePrompt';

export const AddSong: React.FC = () => {
  const navigate = useNavigate();
  const { addTrack } = useData();
  const [isDirty, setIsDirty] = useState(false);

  // Initial Form State
  const [formData, setFormData] = useState<Partial<Track>>({
    title: '',
    artist: 'Willwi',
    versionLabel: 'Original',
    releaseDate: new Date().toISOString().split('T')[0],
    languages: [Language.MANDARIN],
    project: ProjectType.INDEPENDENT,
    isEditorsPick: false,
    isrc: '',
    upc: '',
    spotifyId: '',
    coverImage: '',
    description: '',
    lyrics: '',
    musixmatchUrl: '',
    youtubeMusicUrl: ''
  });

  // 啟用未儲存變更的提示
  usePrompt("您有未儲存的變更，確定要離開嗎？", isDirty);

  const handleChange = (field: keyof Track, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleLanguageChange = (lang: Language) => {
    setFormData(prev => {
      const current = prev.languages || [];
      if (current.includes(lang)) {
        return { ...prev, languages: current.filter(l => l !== lang) };
      } else {
        return { ...prev, languages: [...current, lang] };
      }
    });
    setIsDirty(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple Validation
    if (!formData.title || !formData.isrc) {
      alert('請至少輸入歌名與 ISRC');
      return;
    }

    // Generate ID
    const newTrack: Track = {
      ...formData as Track,
      id: `local_${Date.now()}`,
      // Fallback for cover if empty
      coverImage: formData.coverImage || 'https://picsum.photos/400/400?grayscale', 
    };

    addTrack(newTrack);
    setIsDirty(false); // 重置 Dirty 狀態以免觸發 prompt
    navigate('/database'); // Redirect to list view
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
           <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white mb-2 transition-colors">
             <ArrowLeft size={16} className="mr-1"/> 返回
           </button>
           <h1 className="text-3xl font-bold text-white">新增歌曲資料</h1>
           <p className="text-gray-400">填寫表單以建立新的作品檔案。</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-willwi-surface rounded-xl border border-white/5 p-6 md:p-8 space-y-8">
        
        {/* Section 1: Basic Info */}
        <div className="space-y-6">
           <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">基本資訊</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm text-gray-400">歌名 (Title) *</label>
                <input required type="text" value={formData.title} onChange={e => handleChange('title', e.target.value)} className="w-full bg-willwi-dark border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-willwi-primary outline-none" placeholder="例如：失物招領" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-400">版本標記 (Version Label)</label>
                <input type="text" value={formData.versionLabel} onChange={e => handleChange('versionLabel', e.target.value)} className="w-full bg-willwi-dark border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-willwi-primary outline-none" placeholder="例如：Acoustic Ver." />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm text-gray-400">發行日期 (Release Date)</label>
                <input type="date" value={formData.releaseDate} onChange={e => handleChange('releaseDate', e.target.value)} className="w-full bg-willwi-dark border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-willwi-primary outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-400">專案類型 (Project)</label>
                <select value={formData.project} onChange={e => handleChange('project', e.target.value)} className="w-full bg-willwi-dark border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-willwi-primary outline-none">
                   {Object.values(ProjectType).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
           </div>

           <div>
              <label className="text-sm text-gray-400 mb-2 block">語言 (可複選)</label>
              <div className="flex flex-wrap gap-2">
                 {Object.values(Language).map(lang => (
                    <button
                      type="button"
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                         formData.languages?.includes(lang) 
                           ? 'bg-willwi-primary/20 border-willwi-primary text-willwi-primary' 
                           : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                       {lang}
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Section 2: Metadata */}
        <div className="space-y-6">
           <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">版權與識別碼</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm text-gray-400">ISRC *</label>
                <input required type="text" value={formData.isrc} onChange={e => handleChange('isrc', e.target.value)} className="w-full bg-willwi-dark border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-willwi-primary outline-none font-mono" placeholder="TW-xxx-xx-xxxxx" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-400">UPC</label>
                <input type="text" value={formData.upc} onChange={e => handleChange('upc', e.target.value)} className="w-full bg-willwi-dark border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-willwi-primary outline-none font-mono" />
              </div>
           </div>
        </div>

        {/* Section 3: Content & Assets */}
        <div className="space-y-6">
           <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">內容與素材</h3>
           
           <div className="space-y-1">
              <label className="text-sm text-gray-400">封面圖片網址 (Cover URL)</label>
              <input type="text" value={formData.coverImage} onChange={e => handleChange('coverImage', e.target.value)} className="w-full bg-willwi-dark border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-willwi-primary outline-none" placeholder="https://..." />
           </div>

           <div className="space-y-1">
              <label className="text-sm text-gray-400">完整歌詞 (Lyrics)</label>
              <textarea 
                value={formData.lyrics} 
                onChange={e => handleChange('lyrics', e.target.value)} 
                className="w-full bg-willwi-dark border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-willwi-primary outline-none h-40" 
                placeholder="在此貼上歌詞..."
              ></textarea>
           </div>
           
           <div className="space-y-1">
              <label className="text-sm text-gray-400">背後故事 / 描述 (Description)</label>
              <textarea value={formData.description} onChange={e => handleChange('description', e.target.value)} className="w-full bg-willwi-dark border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-willwi-primary outline-none h-24"></textarea>
           </div>
        </div>

        {/* Section 4: Links */}
        <div className="space-y-6">
           <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">平台連結</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                 <label className="text-sm text-gray-400">Spotify ID</label>
                 <input type="text" value={formData.spotifyId} onChange={e => handleChange('spotifyId', e.target.value)} className="w-full bg-willwi-dark border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-willwi-primary outline-none" placeholder="例如：4iV5W9uY..." />
              </div>
              <div className="space-y-1">
                 <label className="text-sm text-gray-400">YouTube Video URL</label>
                 <input type="text" value={formData.lyricVideoUrl} onChange={e => handleChange('lyricVideoUrl', e.target.value)} className="w-full bg-willwi-dark border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-willwi-primary outline-none" placeholder="https://youtube.com/..." />
              </div>
              <div className="space-y-1">
                 <label className="text-sm text-gray-400">Musixmatch URL</label>
                 <input type="text" value={formData.musixmatchUrl} onChange={e => handleChange('musixmatchUrl', e.target.value)} className="w-full bg-willwi-dark border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-willwi-primary outline-none" />
              </div>
           </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
           <button type="button" onClick={() => navigate('/database')} className="px-6 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">取消</button>
           <button type="submit" className="px-8 py-3 bg-willwi-primary hover:bg-willwi-primary/90 text-white font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-willwi-primary/20 transition-all">
             <Save size={20} /> 儲存至資料庫
           </button>
        </div>

      </form>
    </div>
  );
};
