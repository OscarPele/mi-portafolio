import { useNavigate } from "react-router-dom";
import "./verified.css";

export default function Verified() {
  const navigate = useNavigate();

  return (
    <main className="verify-page">
      <section className="verify-card">
        <h1 className="verify-title">Correo verificado correctamente</h1>
        <p className="verify-text">
          Tu cuenta de OP ERP ya está activa. Inicia sesión para acceder al panel de gestión.
        </p>

        <div className="verify-actions">
          <button className="verify-btn verify-btn-primary" onClick={() => navigate("/proyecto/login")}>
            Iniciar sesión
          </button>
          <button className="verify-btn verify-btn-secondary" onClick={() => navigate("/proyecto")}>
            Volver al acceso
          </button>
        </div>
      </section>
    </main>
  );
}
