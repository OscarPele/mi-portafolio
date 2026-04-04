interface AuthHomeProps {
  onLogin: () => void;
  onRegister: () => void;
}

export default function AuthHome({ onLogin, onRegister }: AuthHomeProps) {
  return (
    <div className="auth-page">
      <div className="auth-home__actions">
        <button
          type="button"
          className="auth-button auth-button--block auth-button--lg auth-button--text-lg auth-button--primary"
          onClick={onLogin}
        >
          Iniciar sesion
        </button>
        <button
          type="button"
          className="auth-button auth-button--block auth-button--lg auth-button--text-lg auth-button--outline"
          onClick={onRegister}
        >
          Crear cuenta
        </button>
      </div>
    </div>
  );
}
