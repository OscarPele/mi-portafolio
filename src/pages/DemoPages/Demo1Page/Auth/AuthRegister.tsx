import { useMemo, useState } from 'react';
import { register } from '../api/auth/authApi';
import AuthMessageModal from './AuthMessageModal';

interface AuthRegisterProps {
  onBack: () => void;
}

export default function AuthRegister({ onBack }: AuthRegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [serverError, setServerError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const passwordsMatch = useMemo(() => {
    if (!password || !password2) return false;
    return password === password2;
  }, [password, password2]);

  const canSubmit = useMemo(() => {
    if (submitting) return false;
    if (!name.trim()) return false;
    if (!email.trim()) return false;
    if (!password) return false;
    if (!password2) return false;
    if (!passwordsMatch) return false;
    return true;
  }, [name, email, password, password2, passwordsMatch, submitting]);

  const onSubmit = async () => {
    if (!canSubmit) return;
    try {
      setServerError('');
      setSubmitting(true);
      await register({ username: name.trim(), email: email.trim(), password });
      setShowModal(true);
    } catch {
      setServerError('No se pudo crear la cuenta. Intentalo de nuevo.');
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
        <h1 className="auth-title">Crear cuenta</h1>
      </header>

      <div className="auth-form">
        <label className="auth-label">Nombre</label>
        <input
          value={name}
          onChange={e => { setName(e.target.value); setServerError(''); }}
          placeholder="Tu nombre"
          className="auth-input"
          autoCapitalize="words"
          autoCorrect="off"
          disabled={submitting}
        />

        <label className="auth-label">Correo electronico</label>
        <input
          value={email}
          onChange={e => { setEmail(e.target.value); setServerError(''); }}
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
          onChange={e => { setPassword(e.target.value); setServerError(''); }}
          placeholder="••••••••"
          className="auth-input"
          type="password"
          autoCapitalize="none"
          autoCorrect="off"
          disabled={submitting}
        />

        <label className="auth-label">Confirmar contrasena</label>
        <input
          value={password2}
          onChange={e => { setPassword2(e.target.value); setServerError(''); }}
          placeholder="••••••••"
          className="auth-input"
          type="password"
          disabled={submitting}
          onKeyDown={e => { if (e.key === 'Enter') onSubmit(); }}
        />

        {!submitting && password2.length > 0 && !passwordsMatch && (
          <div className="auth-error">Las contrasenas no coinciden.</div>
        )}

        {!submitting && serverError && (
          <div className="auth-error">{serverError}</div>
        )}

        <button
          type="button"
          className="auth-button auth-button--block auth-button--lg auth-button--spaced auth-button--text-md auth-button--primary"
          onClick={onSubmit}
          disabled={!canSubmit}
        >
          {submitting ? <span className="auth-spinner" aria-label="Cargando" /> : 'Registrarse'}
        </button>
      </div>

      <AuthMessageModal
        open={showModal}
        title="Cuenta creada"
        message="Te hemos enviado un correo de verificacion. Revisalo para activar tu cuenta."
        actionLabel="Entendido"
        onAction={() => { setShowModal(false); onBack(); }}
      />
    </main>
  );
}
