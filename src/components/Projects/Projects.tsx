import React from 'react';
import { Link } from 'react-router-dom';
import './Projects.scss';

export const Projects: React.FC = () => {
  return (
    <section className="projects">
      <div id="proyectos" className="projects-main-container">
        <div className="projects-content">
          <h1 className="projects-h1">PROYECTO DESTACADO</h1>
          <div className="blue-line" />
          <p className="projects-description">
            Desarrollo completo de una plataforma funcional
          </p>
        </div>

        <div className="project-link-wrapper">
          <Link to="/proyecto" className="project-link-button">
            Ver proyecto
          </Link>
        </div>
      </div>
    </section>
  );
};
