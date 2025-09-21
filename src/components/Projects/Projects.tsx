import React from 'react';
import './Projects.scss';
import Project from './Project/Project';
import rawProjectsData from '../Projects/ProjectsData.json';
import { images } from './projects-images/projects-images';

interface ProjectData {
  id: number;
  description: string;
  image: string;
  route: string;
}

const projectsData = rawProjectsData as ProjectData[];

export const Projects: React.FC = () => {
  return (
    <section className="projects">
      <div id="proyectos" className="projects-main-container">
        <div className="projects-content">
          <h1 className="projects-h1">PROYECTOS</h1>
          <div className="blue-line" />
          <p className="projects-description">
            En este apartado expongo una serie de microservicios independientes que forman parte de un macroproyecto diseñado para simular el flujo completo de un ERP a modo de videojuego. Cada microservicio ha sido desarrollado de manera aislada con Java y Spring Boot, siguiendo principios de arquitectura limpia y enfocados en la exposición de APIs RESTful. Además, han sido probados con JUnit, contenedorizados con Docker y desarrollados e implementados con prácticas en CI/CD (aunque en local con un runner autohosted con GitHub Actions).
            Este proyecto es de carácter personal y tiene como objetivo principal servirme de laboratorio de aprendizaje. A través de él, he buscado adquirir experiencia práctica en las tecnologías y metodologías más demandadas por las empresas, aplicándolas en un entorno funcional y lúdico que me permite experimentar, iterar y consolidar conocimientos de forma progresiva.</p>
        </div>

        <div className="projects-list">
          {projectsData.map(({ id, description, image, route }) => (
            <Project
              key={id}
              id={id}
              description={description}
              image={images[image]}
              route={route}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
