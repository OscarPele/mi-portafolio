import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Nav } from './components/Nav/Nav';
import { Footer } from './components/Footer/Footer';
import { HomePage } from './pages/Home/HomePage';
import { ERPHome } from './pages/ERPProject/ERPHome/ERPHome';
import { ERPMain } from './pages/ERPProject/ERPMain/ERPMain';
import './App.css';

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Nav />
            <HomePage />
            <Footer />
          </>
        }
      />

      <Route path="/proyecto" element={<ERPHome />} />
      <Route path="/proyecto/main/*" element={<ERPMain />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
