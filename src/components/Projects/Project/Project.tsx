
import React from 'react';
import './Project.scss';
import laptopMockup from '../../../assets/jpeg/project-mockup-example.svg';


interface ProjectProps {
  id: number;
  image: string;
  description: string;
}

const Project: React.FC<ProjectProps> = ({ id, image, description }) => {
  return (
    <section className="project-showcase" id={`project-${id}`}>
    
      <div className="project-showcase__media">
        <div className="mockup-container">
        {/* 1) El marco del portátil */}
        <img
            src={laptopMockup}
            alt="Mockup de portátil"
            className="mockup-container__frame"
        />
        {/* 2) Captura dentro de la pantalla */}
        <img
            src={image}
            alt={`Captura del proyecto ${id}`}
            className="mockup-container__screen"
        />
    </div>
      </div>

      <div className="project-showcase__content">
        <h2 className="project-showcase__title">Microservicio {id}</h2>
        <p className="project-showcase__description">
          {description}
        </p>
        <a
          href="#"
          className="button project-showcase__button"
        >
          + Info
        </a>
      </div>
      
    </section>
  );
};

export default Project;
