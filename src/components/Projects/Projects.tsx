import React from 'react';
import './Projects.scss';
import ProjectCard from './ProjectCard/ProjectCard';
import projectsData from './ProjectsData.json';

interface DemoData {
  id: number;
  title: string;
  category: string;
  demonstrates: string;
  description: string;
  tags: string[];
  route: string;
  codeLink: string;
}

const demos = projectsData as DemoData[];

export const Projects: React.FC = () => {
  return (
    <section className="projects">
      <div id="proyectos" className="projects-main-container">
        <div className="projects-content">
          <h1 className="projects-h1">PROYECTOS</h1>
          <div className="blue-line" />
          <p className="projects-description">
            En lugar de proyectos extensos, he apostado por demos concretas y funcionales, cada una centrada en demostrar un conocimiento específico. Este enfoque refleja mi forma de aprender: de manera autodidacta, más allá del plan de estudios, aplicando cada concepto en algo real y funcional. Estas demos son una muestra de ello.
          </p>
        </div>

        <div className="demos-grid">
          {demos.map(demo => (
            <ProjectCard key={demo.id} {...demo} />
          ))}
        </div>
      </div>
    </section>
  );
};
