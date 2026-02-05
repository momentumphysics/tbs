import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

// Context
export const DataContext = React.createContext(null);

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
      offset: 100
    });

    // Fetch initial data
    // In development without backend, we might want valid defaults.
    // Ideally this fetches from the Worker API
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';
      const res = await fetch(`${apiBase}/content`);
      if (res.ok) {
        const jsonData = await res.json();
        setData(jsonData);
      } else {
        throw new Error('Failed to load');
      }
    } catch (e) {
      console.error("Using fallback data due to API error:", e);
      // Fallback data structure matching the database schema
      setData({
        hero: {
          title: 'Temukan Hunian Impian Anda',
          subtitle: 'Pilihan properti terbaik dengan desain modern dan lokasi strategis.'
        },
        contact: {
          description: 'Menyediakan hunian berkualitas.',
          contacts: [
            { id: 1, name: 'Rizqi', phone: '089669153464' },
            { id: 2, name: 'Achmad', phone: '085780574811' }
          ]
        },
        catalog: {
          estates: [
            { id: 1, name: 'Cluster Dahlia' },
            { id: 2, name: 'Cluster Pinisi' },
            { id: 3, name: 'Cluster Edelweiss' }
          ],
          houses: [] // Populated by default in ProductCatalog if empty
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <DataContext.Provider value={{ data, refreshData: fetchData }}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit" element={<Login />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </DataContext.Provider>
  );
}

export default App;
