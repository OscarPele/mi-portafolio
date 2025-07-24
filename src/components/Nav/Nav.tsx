import React, { useState } from "react";
import icono from "../../assets/icono.svg";
import "./Nav.scss";

export const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="nav-wrap">
      <nav className="nav" aria-label="Primary">
        <div className="nav-brand">
          <img src={icono} alt="Logo" className="nav-icon" />
          <span className="nav-name">OSCAR PELEGRINA</span>
        </div>

        {/* Botón burger (sólo en móvil) */}
        <button
          className="nav-toggle"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="burger" />
          <span className="burger" />
          <span className="burger" />
        </button>

        <ul className={`nav-links${isOpen ? " open" : ""}`}>
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#sobre-mi">Sobre Mi</a></li>
          <li><a href="#proyectos">Proyectos</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
      </nav>
    </header>
  );
};
