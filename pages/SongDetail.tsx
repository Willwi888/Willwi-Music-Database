
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Disc, Edit2, Save, X, Bot, Music, Video, Share2, Mic2, PlayCircle, Link as LinkIcon, FileText, AlignLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import { getSongInsight } from '../services/geminiService';
import { ProjectType } from '../types';
import { SOCIAL_LINKS } from '../constants';
import { usePrompt } from '../hooks/usePrompt';

export const SongDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tracks, updateTrack } = useData();
  
  const [track, setTrack] = useState(tracks.find(t => t.id === id));
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  
  // AI State
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // 當處於編輯模式時，攔截導航
  usePrompt("您正在編輯中，未儲存的變更將會遺失。確定要離開嗎？", isEditing);

  useEffect(() => {
    const found = tracks.find(t => t.id === id);
    if (found) {
      setTrack(found);
      setEditForm(found);
    }
  }, [id, tracks]);

  if (!track) {
    return <div className="p-8 text-center text-white">找不到該歌曲</div>;
  }

  const handleGenerateInsight = async () => {
    setIsLoadingAi(true);
    const insight = await getSongInsight(track);
    setAiInsight(insight);
    setIsLoadingAi(false);
  };

  const handleSave = () => {
    updateTrack(track.id, editForm);
    setTrack({ ...track, ...editForm });
    setIsEditing(false); // 這會解除 usePrompt 的攔截
  };

  const handleChange = (field: string, value: any) => {
    setEditForm((prev: any) => ({ ...prev, [field]: value }));
  };

  // Helper to get value based on mode
  const getValue = (field: string) => isEditing ? (editForm[field] || '') : (track as any)[field];

  // Resolve external links: prioritize track-specific URL, fallback to global Artist URL
  const musixmatchLink = getValue('musixmatchUrl') || SOCIAL_LINKS.musixmatch;
  const youtubeMusicLink = getValue('youtubeMusicUrl') || SOCIAL_LINKS.youtubeMusic;

  return (
    <div className="min-h-screen bg-willwi-dark pb-20">
      {/* Hero Header */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={track.coverImage} alt="bg" className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-willwi-dark to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex items-end gap-6">
          <div className="relative group">
            <img src={track.coverImage} alt={track.title} className="w-40 h-40 rounded-xl shadow-2xl border border-white/10 hidden sm:block object-cover" />
            {isEditing && (
              <div className="absolute inset-0 bg-black/60 hidden sm:flex items-center justify-center rounded-xl">
                 <div className="w-full px-2">
                   <input 
                      type="text" 
                      placeholder="封面網址..."
                      value={editForm.coverImage}
                      onChange={(e) => handleChange('coverImage', e.target.value)}
                      className="w-full text-xs bg-transparent border-b border-white text-white focus:outline-none"
                   />
                 </div>
              </div>
            )}
          </div>
          
          <div className="flex-1">
             <Link to="/database" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-4 transition-colors">
               <ArrowLeft size={14} className="mr-1" /> 返回資料庫
             </Link>
             
             {isEditing ? (
               <input 
                 type="text" 
                 value={editForm.title} 
                 onChange={(e) => handleChange('title', e.target.value)}
                 className="text-4xl md:text-5xl font-bold text-white bg-transparent border-b border-white/20 focus:border-willwi-primary outline-none w-full mb-2"
               />
             ) : (
               <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{track.title}</h1>
             )}
             
             <div className="flex items-center gap-3">
               <p className="text-xl text-willwi-primary font-medium">{track.artist}</p>
               {isEditing ? (
                  <input 
                    type="text" 
                    value={editForm.versionLabel || ''} 
                    onChange={(e) => handleChange('versionLabel', e.target.value)}
                    placeholder="版本 (如: Acoustic Ver.)"
                    className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-willwi-primary"
                  />
               ) : (
                  track.versionLabel && <span className="px-2 py-0.5 border border-white/20 rounded text-sm text-gray-300">{track.versionLabel}</span>
               )}
             </div>
          </div>
          
          <div className="flex gap-2">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition-colors" title="編輯模式">
                <Edit2 size={20} />
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(false)} className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30" title="取消">
                  <X size={20} />
                </button>
                <button onClick={handleSave} className="p-2 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30" title="儲存變更">
                  <Save size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Metadata & Lyrics */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Metadata Card */}
          <div className="bg-willwi-surface rounded-xl border border-white/5 overflow-hidden">
            <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Disc size={20} className="text-willwi-accent" /> 
                檔案詳細資訊
              </h3>
            </div>
            
            <div className="p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div className="space-y-4">
                   <MetaField label="ISRC" value={getValue('isrc')} isEditing={isEditing} onChange={(v) => handleChange('isrc', v)} />
                   <MetaField label="UPC" value={getValue('upc')} isEditing={isEditing} onChange={(v) => handleChange('upc', v)} />
                   <MetaField label="Spotify ID" value={getValue('spotifyId')} isEditing={isEditing} onChange={(v) => handleChange('spotifyId', v)} />
                 </div>
                 <div className="space-y-4">
                   <MetaField label="發行日期" value={getValue('releaseDate')} isEditing={isEditing} type="date" onChange={(v) => handleChange('releaseDate', v)} />
                   
                   {/* Project Type Select */}
                   <div className="group">
                     <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block text-gray-400">所屬專案</label>
                     {isEditing ? (
                        <select 
                          value={editForm.project}
                          onChange={(e) => handleChange('project', e.target.value)}
                          className="w-full bg-willwi-dark border border-willwi-primary/50 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-willwi-primary"
                        >
                          {Object.values(ProjectType).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                     ) : (
                        <div className="text-gray-200">{track.project}</div>
                     )}
                   </div>

                   {/* Languages Display */}
                   <div>
                      <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block text-gray-400">語言</label>
                      <div className="flex flex-wrap gap-2">
                        {track.languages.map(l => (
                          <span key={l} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 border border-white/10">{l}</span>
                        ))}
                        {isEditing && <span className="text-xs text-gray-500 self-center">(語言請至新增頁面設定)</span>}
                      </div>
                   </div>
                 </div>
               </div>

               {/* External Links Edit Section */}
               {isEditing && (
                 <div className="border-t border-white/5 pt-6 mt-2">
                    <h4 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                      <LinkIcon size={16} /> 連結設定 (External Links)
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                       <MetaField 
                          label="Musixmatch 歌曲連結" 
                          value={getValue('musixmatchUrl')} 
                          isEditing={true} 
                          onChange={(v) => handleChange('musixmatchUrl', v)} 
                          placeholder="https://www.musixmatch.com/lyrics/..."
                       />
                       <MetaField 
                          label="YouTube Music 歌曲連結" 
                          value={getValue('youtubeMusicUrl')} 
                          isEditing={true} 
                          onChange={(v) => handleChange('youtubeMusicUrl', v)}
                          placeholder="https://music.youtube.com/watch?v=..."
                       />
                    </div>
                 </div>
               )}
            </div>
          </div>

          {/* Description & Lyrics */}
          <div className="bg-willwi-surface rounded-xl border border-white/5 overflow-hidden">
             <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <FileText size={20} className="text-blue-400" />
                  歌詞與介紹
                </h3>
             </div>
             <div className="p-6 space-y-6">
                
                {/* Description */}
                <div>
                   <label className="text-xs text-gray-500 uppercase font-semibold mb-2 block">背後故事</label>
                   {isEditing ? (
                      <textarea 
                        value={editForm.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full h-24 bg-willwi-dark border border-willwi-primary/50 rounded p-3 text-white text-sm focus:outline-none"
                      />
                   ) : (
                      <p className="text-gray-300 leading-relaxed text-sm">{track.description || "尚無描述。"}</p>
                   )}
                </div>

                {/* Lyrics */}
                <div>
                   <label className="text-xs text-gray-500 uppercase font-semibold mb-2 flex items-center gap-2">
                     <AlignLeft size={14}/> 完整歌詞
                   </label>
                   {isEditing ? (
                      <textarea 
                        value={editForm.lyrics || ''}
                        onChange={(e) => handleChange('lyrics', e.target.value)}
                        className="w-full h-64 bg-willwi-dark border border-willwi-primary/50 rounded p-3 text-white text-sm focus:outline-none font-mono"
                        placeholder="請在此貼上歌詞..."
                      />
                   ) : (
                      <div className="bg-black/20 rounded-lg p-4 max-h-[400px] overflow-y-auto custom-scrollbar border border-white/5">
                        <pre className="text-gray-300 font-sans whitespace-pre-wrap leading-7">{track.lyrics || "尚未輸入歌詞。"}</pre>
                      </div>
                   )}
                </div>
             </div>
          </div>

          {/* AI Insight Section */}
          <div className="bg-gradient-to-br from-willwi-primary/10 to-willwi-accent/5 rounded-xl border border-willwi-primary/20 p-6 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-willwi-primary/20 rounded-lg text-willwi-primary">
                  <Bot size={24} />
                </div>
                <div>
                   <h3 className="font-bold text-lg text-white">Willwi AI 樂評</h3>
                   <p className="text-xs text-gray-400">Gemini 2.5 Flash 驅動</p>
                </div>
              </div>
              
              <div className="min-h-[80px]">
                {isLoadingAi ? (
                  <div className="flex items-center gap-2 text-gray-400 animate-pulse">
                     <span className="w-2 h-2 bg-willwi-primary rounded-full animate-bounce"></span>
                     正在分析中繼資料...
                  </div>
                ) : aiInsight ? (
                  <p className="text-gray-200 leading-relaxed italic border-l-2 border-willwi-accent pl-4">
                    "{aiInsight}"
                  </p>
                ) : (
                   <div className="text-gray-400 text-sm">
                     探索這首歌曲背後的隱藏意涵與文化背景。
                     <br/>
                     <button onClick={handleGenerateInsight} className="mt-3 px-4 py-2 bg-willwi-primary hover:bg-willwi-primary/80 text-white rounded-lg text-sm font-medium transition-colors">
                       生成 AI 解析
                     </button>
                   </div>
                )}
              </div>
            </div>
          </div>

          {/* Lyric Video & Creation CTA */}
           <div className="bg-willwi-surface rounded-xl border border-white/5 overflow-hidden">
             <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <Video size={20} className="text-green-400" />
                  歌詞影片 (Lyric Video) 與二創
                </h3>
             </div>
             <div className="p-6">
                
                {isEditing && (
                    <div className="mb-6 bg-white/5 p-4 rounded-lg border border-white/10">
                        <label className="text-xs text-gray-500 uppercase font-semibold mb-2 block">YouTube 歌詞影片連結</label>
                        <input 
                            type="text"
                            value={editForm.lyricVideoUrl || ''}
                            onChange={(e) => handleChange('lyricVideoUrl', e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full bg-willwi-dark border border-willwi-primary/50 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-willwi-primary"
                        />
                    </div>
                )}

                {getValue('lyricVideoUrl') ? (
                   <div className="aspect-video w-full rounded-lg overflow-hidden bg-black mb-6 border border-white/10 relative group">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={(getValue('lyricVideoUrl') || '').replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
                        title="Lyric Video" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                   </div>
                ) : (
                  <div className="aspect-video w-full bg-black/50 rounded-lg flex flex-col items-center justify-center text-gray-500 mb-6 border border-white/5 border-dashed">
                    <Video className="mb-2 opacity-50" size={32} />
                    <span>尚無連結歌詞影片</span>
                  </div>
                )}
                
                <div className="bg-white/5 rounded-lg p-5 border border-white/10 flex flex-col md:flex-row items-center gap-6">
                   <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shrink-0 shadow-lg shadow-purple-500/20">
                      <Share2 size={24} className="text-white" />
                   </div>
                   <div className="flex-1 text-center md:text-left">
                      <h4 className="text-white font-bold mb-1">鼓勵共同創作</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        我們已將歌詞影片與音樂資料庫串聯。歡迎下載官方素材製作 Remix 或二創影片，標記 <span className="text-willwi-accent">@Willwi888</span> 就有機會被官方轉發！
                      </p>
                   </div>
                   <button className="px-6 py-2 rounded-full border border-white/20 hover:bg-white text-white hover:text-black transition-all font-medium text-sm whitespace-nowrap">
                     取得素材
                   </button>
                </div>
             </div>
           </div>

        </div>

        {/* Right Column: Player & Links */}
        <div className="space-y-6">
           {/* Spotify Embed */}
           <div className="bg-willwi-surface rounded-xl border border-white/5 p-4 shadow-xl">
              <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                <Music size={16}/> 試聽預覽
              </h3>
              <div className="w-full h-[380px] rounded-lg overflow-hidden bg-[#282828] flex items-center justify-center">
                 {getValue('spotifyId') ? (
                    <iframe 
                    style={{borderRadius: '12px'}} 
                    src={`https://open.spotify.com/embed/track/${getValue('spotifyId')}?utm_source=generator&theme=0`} 
                    width="100%" 
                    height="352" 
                    frameBorder="0" 
                    allowFullScreen 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                    ></iframe>
                 ) : (
                     <div className="text-center text-gray-500 p-8">
                         <Music size={48} className="mx-auto mb-2 opacity-20" />
                         <p>未輸入 Spotify ID</p>
                     </div>
                 )}
              </div>
           </div>

           {/* Quick Actions */}
           <div className="grid grid-cols-2 gap-4">
              <a href={SOCIAL_LINKS.spotify} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-4 bg-[#1DB954]/10 border border-[#1DB954]/20 hover:bg-[#1DB954]/20 rounded-xl transition-colors group">
                 <Music className="mb-2 text-[#1DB954] group-hover:scale-110 transition-transform" />
                 <span className="text-xs font-bold text-[#1DB954]">Spotify</span>
              </a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-4 bg-[#FF0000]/10 border border-[#FF0000]/20 hover:bg-[#FF0000]/20 rounded-xl transition-colors group">
                 <Video className="mb-2 text-[#FF0000] group-hover:scale-110 transition-transform" />
                 <span className="text-xs font-bold text-[#FF0000]">YouTube MV</span>
              </a>
              <a href={musixmatchLink} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-4 bg-[#FF5C00]/10 border border-[#FF5C00]/20 hover:bg-[#FF5C00]/20 rounded-xl transition-colors group">
                 <Mic2 className="mb-2 text-[#FF5C00] group-hover:scale-110 transition-transform" />
                 <span className="text-xs font-bold text-[#FF5C00]">Musixmatch</span>
              </a>
              <a href={youtubeMusicLink} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-4 bg-[#FF0000]/10 border border-[#FF0000]/20 hover:bg-[#FF0000]/20 rounded-xl transition-colors group">
                 <PlayCircle className="mb-2 text-[#FF0000] group-hover:scale-110 transition-transform" />
                 <span className="text-xs font-bold text-[#FF0000]">YT Music</span>
              </a>
           </div>
        </div>
      </div>
    </div>
  );
};

const MetaField: React.FC<{ label: string, value: string, isEditing: boolean, onChange: (v: string) => void, type?: string, placeholder?: string }> = ({ label, value, isEditing, onChange, type = "text", placeholder }) => (
  <div className="group">
    <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block group-hover:text-willwi-primary transition-colors">{label}</label>
    {isEditing ? (
      <input 
        type={type}
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-willwi-dark border border-willwi-primary/50 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-willwi-primary placeholder-gray-600"
      />
    ) : (
      <div className="text-gray-200 font-mono text-sm break-all">{value || <span className="text-gray-600 italic">未設定</span>}</div>
    )}
  </div>
);
