import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./verified.css";

export default function VerifiedError() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const reason = params.get("reason") || "";

  const message = useMemo(() => {
    switch (reason) {
      case "TOKEN_EXPIRED":
        return "El enlace de verificación ha caducado. Solicita uno nuevo desde la pantalla de inicio de sesión.";
      case "TOKEN_ALREADY_USED":
        return "Este enlace de verificación ya se ha usado. Puedes iniciar sesión si tu cuenta ya está activada.";
      case "INVALID_TOKEN":
        return "El enlace de verificación no es válido. Solicita uno nuevo desde la pantalla de inicio de sesión.";
      default:
        return "No se pudo verificar el correo. Solicita un nuevo enlace desde la pantalla de inicio de sesión.";
    }
  }, [reason]);

  return (
    <main className="verify-page">
      <section className="verify-card">
        <h1 className="verify-title">No se pudo verificar el correo</h1>
        <p className="verify-text">{message}</p>

        <div className="verify-actions">
          <button className="verify-btn verify-btn-primary" onClick={() => navigate("/proyecto/login")}>
            Ir a iniciar sesión
          </button>
          <button className="verify-btn verify-btn-secondary" onClick={() => navigate("/proyecto/register")}>
            Crear una cuenta
          </button>
        </div>

        {reason ? (
          <p className="verify-code">
            <span className="verify-codeLabel">Código:</span>{" "}
            <code className="verify-codeChip">{reason}</code>
          </p>
        ) : null}
      </section>
    </main>
  );
}
