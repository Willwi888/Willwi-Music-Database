import React from 'react';
import { createHashRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Database } from './pages/Database';
import { SongDetail } from './pages/SongDetail';
import { AddSong } from './pages/AddSong';

// Define Routes using Data Router to support useBlocker (for usePrompt hook)
const router = createHashRouter([
  {
    path: "/",
    element: <Layout><Outlet /></Layout>,
    children: [
      { index: true, element: <Home /> },
      { path: "database", element: <Database /> },
      { path: "add", element: <AddSong /> },
      { path: "track/:id", element: <SongDetail /> },
      { path: "*", element: <Navigate to="/" replace /> }
    ]
  }
]);

const App: React.FC = () => {
  return (
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  );
};

export default App;