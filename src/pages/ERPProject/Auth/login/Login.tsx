import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { login } from "../../../../api/auth/login";
import { resendVerificationEmail } from "../../../../api/auth/register";
import { saveAuthSession } from "../../../../api/auth/jwtUtils";
import { useAuth } from "../../../../context/AuthContext";
import "../auth-shared.css";
import "./Login.css";

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

export default function Login() {
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resendingVerification, setResendingVerification] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    if (submitting) return false;
    if (!usernameOrEmail.trim()) return false;
    if (!password) return false;
    return true;
  }, [usernameOrEmail, password, submitting]);

  const canResendVerification = useMemo(() => {
    if (resendingVerification) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail.trim());
  }, [resendingVerification, usernameOrEmail]);

  const onSubmit = async () => {
    if (!canSubmit) return;

    try {
      setErrorCode("");
      setResendMessage("");
      setSubmitting(true);

      const res = await login({
        usernameOrEmail: usernameOrEmail.trim(),
        password,
      });

      await saveAuthSession(res);
      await refresh();
      navigate("/proyecto/main", { replace: true });
    } catch (e: any) {
      const code =
        typeof e?.message === "string" && /^[A-Z_]+$/.test(e.message)
          ? e.message
          : "UNKNOWN";
      setErrorCode(code);
    } finally {
      setSubmitting(false);
    }
  };

  const onResendVerification = async () => {
    if (!canResendVerification) {
      setResendMessage("Introduce tu correo electrónico para reenviar la verificación.");
      return;
    }

    try {
      setResendMessage("");
      setResendingVerification(true);
      await resendVerificationEmail(usernameOrEmail.trim());
      setResendMessage("Correo de verificación reenviado. Revisa tu bandeja de entrada.");
    } catch {
      setResendMessage("No se pudo reenviar el correo. Inténtalo de nuevo más tarde.");
    } finally {
      setResendingVerification(false);
    }
  };

  return (
    <main className="auth-page auth-login">
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
        <h1 className="auth-title">Iniciar sesión</h1>
      </header>

      <div className="auth-form">
        <label className="auth-label">
          Usuario o correo electrónico
        </label>
        <input
          value={usernameOrEmail}
          onChange={(event) => {
            setUsernameOrEmail(event.target.value);
            setErrorCode("");
            setResendMessage("");
          }}
          placeholder="usuario o correo@empresa.com"
          className="auth-input"
          type="text"
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
            setErrorCode("");
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

        {errorCode ? (
          <div className="auth-error">
            {getAuthErrorMessage(errorCode)}
          </div>
        ) : null}

        {errorCode === "EMAIL_NOT_VERIFIED" ? (
          <button
            type="button"
            className="auth-button auth-button--block auth-button--md auth-button--text-sm auth-button--secondary"
            onClick={onResendVerification}
            disabled={resendingVerification}
          >
            {resendingVerification ? <>Reenviando...</> : <>Reenviar correo de verificación</>}
          </button>
        ) : null}

        {resendMessage ? (
          <div className="auth-feedback">
            {resendMessage}
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
            <>Iniciar sesión</>
          )}
        </button>
      </div>
    </main>
  );
}
