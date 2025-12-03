
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Database } from './pages/Database';
import { SongDetail } from './pages/SongDetail';
import { AddSong } from './pages/AddSong';

const App: React.FC = () => {
  return (
    <DataProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/database" element={<Database />} />
            <Route path="/add" element={<AddSong />} />
            <Route path="/track/:id" element={<SongDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </DataProvider>
  );
};

export default App;
