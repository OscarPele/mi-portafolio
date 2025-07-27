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
            En este apartado expongo una serie de microservicios independientes…
          </p>
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
