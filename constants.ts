
import { Track, Language, ProjectType } from './types';

export const SOCIAL_LINKS = {
  spotify: "https://open.spotify.com/artist/3ascZ8Rb2KDw4QyCy29Om4",
  apple: "https://music.apple.com/us/artist/willwi/1798471457",
  youtube: "https://www.youtube.com/@Willwi888",
  website: "https://willwi.com",
  musixmatch: "https://www.musixmatch.com/artist/Willwi",
  youtubeMusic: "https://music.youtube.com/channel/UCAF8vdEOJ5sBdRuZXL61ASw"
};

// Simulated Airtable Data
export const INITIAL_TRACKS: Track[] = [
  {
    id: 'rec1',
    title: '再愛一次 (Love Again)',
    artist: 'Willwi',
    releaseDate: '2023-11-15',
    languages: [Language.MANDARIN, Language.ENGLISH],
    project: ProjectType.INDEPENDENT,
    isEditorsPick: true,
    isrc: 'TW-A01-23-00001',
    upc: '198000000001',
    spotifyId: '4iV5W9uYEdYUVa79Axb7Rh', // Placeholder ID
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    coverImage: 'https://picsum.photos/400/400?random=1',
    description: '探討重燃舊愛複雜情感的靈魂抒情曲。曾獲 Spotify 編輯推薦。',
    lyricVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    musixmatchUrl: 'https://www.musixmatch.com/lyrics/Willwi/Love-Again', // Example
    youtubeMusicUrl: 'https://music.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 'rec2',
    title: 'Noodle Dreams',
    artist: 'Willwi',
    releaseDate: '2024-01-20',
    languages: [Language.JAPANESE, Language.TAIWANESE],
    project: ProjectType.INSTANT_NOODLE,
    isEditorsPick: false,
    isrc: 'TW-A01-24-00022',
    upc: '198000000002',
    spotifyId: '5n88800000002',
    youtubeId: 'xyz123',
    coverImage: 'https://picsum.photos/400/400?random=2',
    description: '泡麵聲學院計畫下的實驗電子音樂作品，融合了生活中的聲音。'
  },
  {
    id: 'rec3',
    title: 'Seoul Night',
    artist: 'Willwi',
    releaseDate: '2024-02-14',
    languages: [Language.KOREAN, Language.ENGLISH],
    project: ProjectType.INDEPENDENT,
    isEditorsPick: false,
    isrc: 'TW-A01-24-00033',
    upc: '198000000003',
    spotifyId: '6x99900000003',
    coverImage: 'https://picsum.photos/400/400?random=3',
    description: '針對國際市場打造的 City Pop 風格單曲。'
  },
  {
    id: 'rec4',
    title: 'Formosa Rain',
    artist: 'Willwi',
    releaseDate: '2023-08-01',
    languages: [Language.TAIWANESE],
    project: ProjectType.INSTANT_NOODLE,
    isEditorsPick: true,
    isrc: 'TW-A01-23-00015',
    upc: '198000000004',
    spotifyId: '7y77700000004',
    coverImage: 'https://picsum.photos/400/400?random=4',
    description: '傳統樂器與現代 Lo-Fi 節拍的碰撞，營造出雨夜的氛圍。'
  },
  {
    id: 'rec5',
    title: 'Global Citizen',
    artist: 'Willwi',
    releaseDate: '2024-03-01',
    languages: [Language.ENGLISH, Language.MANDARIN, Language.JAPANESE],
    project: ProjectType.INDEPENDENT,
    isEditorsPick: false,
    isrc: 'TW-A01-24-00055',
    upc: '198000000005',
    spotifyId: '8z88800000005',
    coverImage: 'https://picsum.photos/400/400?random=5',
    description: '數位遊牧世代的國歌，跨越語言與國界的連結。'
  }
];
