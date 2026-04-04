import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Nav } from './components/Nav/Nav';
import { Footer } from './components/Footer/Footer';
import { HomePage } from './pages/HomePage';
import './App.css';

const App: React.FC = () => {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
