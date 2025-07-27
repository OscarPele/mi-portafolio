import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Nav } from './components/Nav/Nav';
import { Footer } from './components/Footer/Footer';
import { HomePage } from './pages/HomePage';
import { OverviewProjectPage } from './pages/OverviewProjectPage/OverviewProjectPage';
import './App.css';

const App: React.FC = () => {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/overview-project/:id" element={<OverviewProjectPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
