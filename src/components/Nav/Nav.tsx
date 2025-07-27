import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import icono from "../../assets/icono.svg";
import "./Nav.scss";

export const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSectionClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setIsOpen(false);

    if (pathname === "/") {
      // ya estamos en la HomePage: solo scroll
      handleScroll(sectionId);
    } else {
      // navegamos a "/" y luego hacemos scroll
      navigate("/", { replace: false });
      // pequeño retraso para asegurar que el componente monta
      setTimeout(() => handleScroll(sectionId), 100);
    }
  };

  const handleInicioClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsOpen(false);

    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/", { replace: false });
    }
  };

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
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "active" : undefined)}
              onClick={handleInicioClick}
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <a
              href="#sobre-mi"
              onClick={(e) => handleSectionClick(e, "sobre-mi")}
            >
              Sobre Mi
            </a>
          </li>
          <li>
            <a
              href="#proyectos"
              onClick={(e) => handleSectionClick(e, "proyectos")}
            >
              Proyectos
            </a>
          </li>
          <li>
            <a
              href="#contacto"
              onClick={(e) => handleSectionClick(e, "contacto")}
            >
              Contacto
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
