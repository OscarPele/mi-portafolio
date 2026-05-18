import React, { type ReactElement } from 'react';
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom';
import { Nav } from './pages/Home/Nav/Nav';
import { Footer } from './pages/Home/Footer/Footer';
import { HomePage } from './pages/Home/HomePage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// ERP Project Pages
import AuthHome from './pages/ERPProject/Auth/home/Home';
import Login from './pages/ERPProject/Auth/login/Login';
import Register from './pages/ERPProject/Auth/register/Register';
import Verified from './pages/ERPProject/Auth/Verified/Verified';
import VerifiedError from './pages/ERPProject/Auth/Verified/VerifiedError';
import { ERPMain } from './pages/ERPProject/ERPMain/ERPMain';
import './App.css';
import './pages/ERPProject/Auth/auth-shared.css';

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { status, isAuthenticated } = useAuth();

  if (status === 'checking') {
    return (
      <main className="auth-page">
        <div className="auth-form">
          <div className="auth-feedback">Cargando sesión...</div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/proyecto/login" replace />;
  }

  return children;
}

function AuthEntryRoute() {
  const [searchParams] = useSearchParams();
  const emailVerified = searchParams.get('emailVerified') === '1';
  const emailVerifyError = searchParams.get('emailVerifyError');
  let reason = searchParams.get('reason') ?? '';

  if (!reason && emailVerifyError?.includes('?reason=')) {
    reason = emailVerifyError.split('?reason=')[1] ?? '';
  }

  if (emailVerified) {
    return <Navigate to="/proyecto/verified" replace />;
  }

  if (emailVerifyError !== null || reason) {
    const suffix = reason ? `?reason=${encodeURIComponent(reason)}` : '';
    return <Navigate to={`/proyecto/verify-error${suffix}`} replace />;
  }

  return <AuthHome />;
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
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

          <Route path="/proyecto" element={<AuthEntryRoute />} />
          <Route path="/proyecto/login" element={<Login />} />
          <Route path="/proyecto/register" element={<Register />} />
          <Route path="/proyecto/verified" element={<Verified />} />
          <Route path="/proyecto/verify-error" element={<VerifiedError />} />
          <Route path="/verified" element={<Navigate to="/proyecto/verified" replace />} />
          <Route path="/verify-error" element={<VerifiedError />} />
          <Route
            path="/proyecto/main/*"
            element={
              <ProtectedRoute>
                <ERPMain />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Navigate to="/proyecto/login" replace />} />
          <Route path="/register" element={<Navigate to="/proyecto/register" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
