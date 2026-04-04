import { useState } from 'react';
import AuthHome from './AuthHome';
import AuthLogin from './AuthLogin';
import AuthRegister from './AuthRegister';
import './auth.scss';

type View = 'home' | 'login' | 'register';

export default function AuthDemo() {
  const [view, setView] = useState<View>('home');

  return (
    <div className="auth-demo">
      {view === 'home' && (
        <AuthHome
          onLogin={() => setView('login')}
          onRegister={() => setView('register')}
        />
      )}
      {view === 'login' && (
        <AuthLogin
          onBack={() => setView('home')}
        />
      )}
      {view === 'register' && (
        <AuthRegister
          onBack={() => setView('home')}
        />
      )}
    </div>
  );
}
