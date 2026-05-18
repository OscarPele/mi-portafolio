import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { register } from "../../../../api/auth/register";
import AuthMessageModal from "./AuthMessageModal";
import "../auth-shared.css";
import "./Register.css";

const ERROR_MESSAGES: Record<string, string> = {
  USERNAME_EXISTS: "Ese nombre de usuario ya está en uso.",
  EMAIL_EXISTS: "Ese correo electrónico ya está registrado.",
  VALIDATION_ERROR: "Revisa los datos e inténtalo de nuevo.",
  INVALID_CREDENTIALS: "Correo electrónico o contraseña incorrectos.",
  EMAIL_NOT_VERIFIED: "Tu correo electrónico aún no está verificado.",
  USER_NOT_FOUND: "Usuario no encontrado.",
  CURRENT_PASSWORD_INCORRECT: "La contraseña actual es incorrecta.",
  INVALID_REFRESH_TOKEN: "Tu sesión ha caducado. Inicia sesión de nuevo.",
  REFRESH_TOKEN_EXPIRED_OR_REVOKED: "Tu sesión ha caducado. Inicia sesión de nuevo.",
  UNKNOWN: "Ha ocurrido un error. Inténtalo más tarde.",
};

const getAuthErrorMessage = (code: string) => ERROR_MESSAGES[code] ?? ERROR_MESSAGES.UNKNOWN;

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [serverErrorCode, setServerErrorCode] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const passwordsMatch = useMemo(() => {
    if (!password || !password2) return false;
    return password === password2;
  }, [password, password2]);

  const canSubmit = useMemo(() => {
    if (submitting) return false;
    if (!username.trim()) return false;
    if (!email.trim()) return false;
    if (!password) return false;
    if (!password2) return false;
    if (!passwordsMatch) return false;
    return true;
  }, [username, email, password, password2, passwordsMatch, submitting]);

  const onSubmit = async () => {
    if (!canSubmit) return;

    try {
      setServerErrorCode("");
      setSubmitting(true);

      await register({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      setShowSuccessModal(true);
    } catch (e: any) {
      const code =
        typeof e?.message === "string" && /^[A-Z_]+$/.test(e.message)
          ? e.message
          : "UNKNOWN";
      setServerErrorCode(code);
    } finally {
      setSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/proyecto/login");
  };

  return (
    <main className="auth-page auth-register">
      <header className="auth-header">
        <button
          type="button"
          className="auth-button auth-button--icon auth-button--ghost"
          onClick={() => navigate(-1)}
          aria-label="Atrás"
          disabled={submitting}
        >
          <ArrowUturnLeftIcon className="auth-back-icon" aria-hidden="true" />
        </button>
        <h1 className="auth-title">Registrarse</h1>
      </header>

      <div className="auth-form">
        <label className="auth-label">
          Usuario
        </label>
        <input
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
            setServerErrorCode("");
          }}
          placeholder="Tu usuario"
          className="auth-input"
          autoCapitalize="none"
          autoCorrect="off"
          disabled={submitting}
        />

        <label className="auth-label">
          Correo electrónico
        </label>
        <input
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setServerErrorCode("");
          }}
          placeholder="tu@correo.com"
          className="auth-input"
          type="email"
          autoCapitalize="none"
          autoCorrect="off"
          disabled={submitting}
        />

        <label className="auth-label">
          Contraseña
        </label>
        <input
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setServerErrorCode("");
          }}
          placeholder="••••••••"
          className="auth-input"
          type="password"
          autoCapitalize="none"
          autoCorrect="off"
          disabled={submitting}
        />

        <label className="auth-label">
          Confirmar contraseña
        </label>
        <input
          value={password2}
          onChange={(event) => {
            setPassword2(event.target.value);
            setServerErrorCode("");
          }}
          placeholder="••••••••"
          className="auth-input"
          type="password"
          autoCapitalize="none"
          autoCorrect="off"
          disabled={submitting}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSubmit();
            }
          }}
        />

        {!submitting && password2.length > 0 && !passwordsMatch ? (
          <div className="auth-error auth-error--tight">
            Las contraseñas no coinciden.
          </div>
        ) : null}

        {!submitting && serverErrorCode ? (
          <div className="auth-error auth-error--tight">
            {getAuthErrorMessage(serverErrorCode)}
          </div>
        ) : null}

        <button
          type="button"
          className="auth-button auth-button--block auth-button--lg auth-button--spaced auth-button--text-md auth-button--primary"
          onClick={onSubmit}
          disabled={!canSubmit}
        >
          {submitting ? (
            <span className="auth-spinner" aria-label="Cargando" />
          ) : (
            <>Crear cuenta</>
          )}
        </button>

      </div>

      <AuthMessageModal
        open={showSuccessModal}
        title="Registrarse"
        message="Cuenta creada. Revisa tu correo electrónico para verificarla antes de iniciar sesión."
        actionLabel="Ir a iniciar sesión"
        onAction={closeSuccessModal}
      />
    </main>
  );
}
