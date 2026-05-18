import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import ThemeSelector from "../../../../components/theme/ThemeSelector";

import "../auth-shared.css";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <main className="auth-page auth-home">
      <header className="auth-home__header">
        <div className="auth-home__brand-row" aria-label="OP ERP">
          <h1 className="auth-home__brand">OP ERP</h1>
        </div>

        <p className="auth-home__subtitle">Acceso privado al panel de gestión</p>
      </header>

      <div className="auth-home__actions">
        <button
          type="button"
          className="auth-button auth-button--block auth-button--lg auth-button--text-lg auth-button--primary"
          onClick={() => navigate("/proyecto/login")}
        >
          Iniciar sesión
        </button>

        <button
          type="button"
          className="auth-button auth-button--block auth-button--lg auth-button--text-lg auth-button--outline"
          onClick={() => navigate("/proyecto/register")}
        >
          Registrarse
        </button>
      </div>

      <button
        type="button"
        className="auth-home__settings-trigger"
        onClick={() => setSettingsOpen((prev) => !prev)}
        aria-label="Abrir ajustes"
        aria-expanded={settingsOpen}
        aria-controls="auth-home-settings"
      >
        <IoSettingsOutline size={16} color="var(--theme-text)" />
      </button>

      {settingsOpen ? (
        <div className="auth-home__settings-backdrop" onClick={() => setSettingsOpen(false)}>
          <div
            id="auth-home-settings"
            className="auth-home__settings-popover"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="auth-home__settings-row">
              <ThemeSelector ariaLabel="Cambiar tema" />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
