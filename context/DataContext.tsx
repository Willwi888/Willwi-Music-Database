
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Track } from '../types';
import { INITIAL_TRACKS } from '../constants';

interface DataContextType {
  tracks: Track[];
  addTrack: (track: Track) => void;
  updateTrack: (id: string, updates: Partial<Track>) => void;
  deleteTrack: (id: string) => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'willwi_music_db_v1';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from LocalStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setTracks(JSON.parse(stored));
        } else {
          // Initialize with demo data if storage is empty
          setTracks(INITIAL_TRACKS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TRACKS));
        }
      } catch (e) {
        console.error("Failed to load data", e);
        setTracks(INITIAL_TRACKS);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save to LocalStorage whenever tracks change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
    }
  }, [tracks, isLoading]);

  const addTrack = (newTrack: Track) => {
    setTracks(prev => [newTrack, ...prev]);
  };

  const updateTrack = (id: string, updates: Partial<Track>) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTrack = (id: string) => {
    if (window.confirm('確定要刪除這首歌曲嗎？此動作無法復原。')) {
      setTracks(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <DataContext.Provider value={{ tracks, addTrack, updateTrack, deleteTrack, isLoading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
