import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Nav } from './components/Nav/Nav';
import { Footer } from './components/Footer/Footer';
import { HomePage } from './pages/HomePage';
import { Demo1Page } from './pages/DemoPages/Demo1Page/Demo1Page';
import { Demo2Page } from './pages/DemoPages/Demo2Page/Demo2Page';
import { Demo3Page } from './pages/DemoPages/Demo3Page/Demo3Page';
import { Demo4Page } from './pages/DemoPages/Demo4Page/Demo4Page';
import './App.css';

const App: React.FC = () => {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demos/1" element={<Demo1Page />} />
        <Route path="/demos/2" element={<Demo2Page />} />
        <Route path="/demos/3" element={<Demo3Page />} />
        <Route path="/demos/4" element={<Demo4Page />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
