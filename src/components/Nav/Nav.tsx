import React from "react";
import icono from "../../assets/icono.svg";
import "./nav.scss";

export const Nav: React.FC = () => (
  <header className="nav-wrap">
    <nav className="nav" aria-label="Primary">
      <div className="nav-brand">
        <img src={icono} alt="Logo" className="nav-icon" />
        <span className="nav-name">OSCAR PELEGRINA</span>
      </div>

      <ul className="nav-links">
        <li><a href="#inicio">Inicio</a></li>
        <li><a href="#sobre-mi">Sobre Mi</a></li>
        <li><a href="#proyectos">Proyectos</a></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>
    </nav>
  </header>
);
