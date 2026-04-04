import { useMemo, useState } from 'react';
import { login } from '../api/auth/authApi';
import { useAuth } from '../context/AuthContext';

interface AuthLoginProps {
  onBack: () => void;
}

export default function AuthLogin({ onBack }: AuthLoginProps) {
  const { saveToken } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    if (submitting) return false;
    if (!email.trim()) return false;
    if (!password) return false;
    return true;
  }, [email, password, submitting]);

  const onSubmit = async () => {
    if (!canSubmit) return;
    try {
      setErrorMsg('');
      setSubmitting(true);
      const res = await login({ usernameOrEmail: email.trim(), password });
      saveToken(res.accessToken);
    } catch (e) {
      const code = e instanceof Error ? e.message : '';
      if (code === 'EMAIL_NOT_VERIFIED') {
        setErrorMsg('Debes verificar tu correo antes de iniciar sesion.');
      } else {
        setErrorMsg('Credenciales incorrectas. Intentalo de nuevo.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <header className="auth-header">
        <button
          type="button"
          className="auth-button auth-button--icon auth-button--ghost"
          onClick={onBack}
          disabled={submitting}
          aria-label="Volver"
        >
          <svg className="auth-back-icon" viewBox="0 0 24 24" fill="none" strokeWidth={2}>
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="auth-title">Iniciar sesion</h1>
      </header>

      <div className="auth-form">
        <label className="auth-label">Correo electronico</label>
        <input
          value={email}
          onChange={e => { setEmail(e.target.value); setErrorMsg(''); }}
          placeholder="tu@email.com"
          className="auth-input"
          type="email"
          autoCapitalize="none"
          autoCorrect="off"
          disabled={submitting}
        />

        <label className="auth-label">Contrasena</label>
        <input
          value={password}
          onChange={e => { setPassword(e.target.value); setErrorMsg(''); }}
          placeholder="••••••••"
          className="auth-input"
          type="password"
          disabled={submitting}
          onKeyDown={e => { if (e.key === 'Enter') onSubmit(); }}
        />

        {errorMsg && <div className="auth-error">{errorMsg}</div>}

        <button
          type="button"
          className="auth-button auth-button--block auth-button--lg auth-button--spaced auth-button--text-md auth-button--primary"
          onClick={onSubmit}
          disabled={!canSubmit}
        >
          {submitting ? <span className="auth-spinner" aria-label="Cargando" /> : 'Entrar'}
        </button>
      </div>
    </main>
  );
}
