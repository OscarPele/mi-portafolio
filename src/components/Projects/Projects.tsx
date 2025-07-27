// src/components/Projects/Projects.tsx
import React from 'react';
import './Projects.scss';
import Project from './Project/Project';
import rawProjectsData from './Descriptions.json';
import { images } from './projects-images/projects-images';

interface ProjectData {
  id: number;
  description: string;
  image: string;
}

const projectsData = rawProjectsData as ProjectData[];

export const Projects: React.FC = () => {
  return (
    <section className="projects">
      <div className="main-container">
        <div className="projects-content">
          <h1 className="projects-h1">PROYECTOS</h1>
          <div className="blue-line" />
          <p className="projects-description">
            En este apartado expongo una serie de microservicios independientes que
            forman parte de una simulación completa del proceso de producción
            industrial. Cada uno representa un área funcional, ha sido testeado con
            JUnit, desplegado con Docker y gestionado con Kubernetes, aplicando
            conocimientos en Java, APIs REST y arquitectura backend.
          </p>
        </div>

        <div className="projects-list">
          {projectsData.map(({ id, description, image }) => (
            <Project
              key={id}
              id={id}
              description={description}
              image={images[image]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
