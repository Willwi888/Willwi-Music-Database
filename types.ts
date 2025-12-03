
export enum Language {
  MANDARIN = '華語',
  TAIWANESE = '台語',
  JAPANESE = '日語',
  KOREAN = '韓語',
  ENGLISH = '英語'
}

export enum ProjectType {
  INDEPENDENT = '獨立發行',
  INSTANT_NOODLE = '泡麵聲學院'
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  versionLabel?: string; // e.g., "Acoustic Ver.", "Japanese Ver.", "Original"
  releaseDate: string; // YYYY-MM-DD
  languages: Language[];
  project: ProjectType;
  isEditorsPick: boolean;
  isrc: string;
  upc: string;
  spotifyId: string;
  youtubeId?: string; // Video ID
  coverImage: string;
  description?: string;
  lyrics?: string; // Full lyrics text
  lyricVideoUrl?: string; // YouTube URL
  
  // Specific external links for this track
  musixmatchUrl?: string;
  youtubeMusicUrl?: string;
  appleMusicUrl?: string;
}

export interface TrackFilterState {
  searchQuery: string;
  languages: Language[];
  project: ProjectType | 'All';
  onlyEditorsPick: boolean;
}
