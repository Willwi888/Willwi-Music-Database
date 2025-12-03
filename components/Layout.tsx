
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music2, Database, ExternalLink, Globe, Mic2, PlayCircle, PlusCircle } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean }> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
      active
        ? 'bg-willwi-primary/20 text-willwi-primary border border-willwi-primary/50'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

const SocialIcon: React.FC<{ href: string; label: string; children: React.ReactNode }> = ({ href, label, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-willwi-accent transition-colors p-2"
    aria-label={label}
    title={label}
  >
    {children}
  </a>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-willwi-dark text-willwi-text flex flex-col font-sans selection:bg-willwi-accent selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-willwi-dark/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-willwi-primary to-willwi-accent flex items-center justify-center text-white font-bold">
                W
              </div>
              <Link to="/" className="text-xl font-bold tracking-tight text-white">
                Willwi <span className="text-xs font-normal text-gray-400 opacity-70 border border-gray-600 rounded px-1 ml-1">Manager</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <NavLink to="/" icon={<Music2 size={18} />} label="作品首頁" active={location.pathname === '/'} />
              <NavLink to="/database" icon={<Database size={18} />} label="管理資料庫" active={location.pathname === '/database'} />
              <Link 
                to="/add" 
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border ${location.pathname === '/add' ? 'bg-willwi-accent/20 border-willwi-accent text-willwi-accent' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}
              >
                <PlusCircle size={18} />
                <span className="font-medium">新增歌曲</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <a 
                href={SOCIAL_LINKS.website} 
                target="_blank" 
                rel="noreferrer"
                className="hidden sm:flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                willwi.com <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
        {/* Mobile Menu Bar */}
        <div className="md:hidden flex justify-around py-2 border-t border-white/5 bg-willwi-surface">
           <Link to="/" className={`p-2 ${location.pathname === '/' ? 'text-willwi-primary' : 'text-gray-400'}`}><Music2 size={24}/></Link>
           <Link to="/database" className={`p-2 ${location.pathname === '/database' ? 'text-willwi-primary' : 'text-gray-400'}`}><Database size={24}/></Link>
           <Link to="/add" className={`p-2 ${location.pathname === '/add' ? 'text-willwi-accent' : 'text-gray-400'}`}><PlusCircle size={24}/></Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-willwi-surface border-t border-white/5 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Willwi</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                以音樂連結文化的跨語言創作者。
                <br/>
                系統版本：v2.0 (Local Manager)
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">官方頻道</h3>
              <div className="flex gap-2 flex-wrap">
                <SocialIcon href={SOCIAL_LINKS.spotify} label="Spotify">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                </SocialIcon>
                <SocialIcon href={SOCIAL_LINKS.youtube} label="YouTube OAC">
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </SocialIcon>
                <SocialIcon href={SOCIAL_LINKS.apple} label="Apple Music">
                  <Music2 size={24} />
                </SocialIcon>
                <SocialIcon href={SOCIAL_LINKS.musixmatch} label="Musixmatch">
                  <Mic2 size={24} />
                </SocialIcon>
                <SocialIcon href={SOCIAL_LINKS.youtubeMusic} label="YouTube Music">
                  <PlayCircle size={24} />
                </SocialIcon>
              </div>
            </div>
            <div>
               <h3 className="text-white font-bold text-lg mb-4">系統狀態</h3>
               <div className="flex flex-col gap-2 text-sm text-gray-500">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span> 本地資料庫已啟用</span>
                  <span className="flex items-center gap-2"><span className="w-2 h-2 bg-willwi-primary rounded-full"></span> 編輯功能就緒</span>
               </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Willwi Music. 本系統資料儲存於您的瀏覽器中。
          </div>
        </div>
      </footer>
    </div>
  );
};
