import React from 'react';
import './Project.scss';
import laptopMockup from '../../../assets/jpeg/project-mockup-example.svg';
import { Link } from 'react-router-dom';

interface ProjectProps {
  id: number;
  image: string;
  description: string;
  route: string;
}

const Project: React.FC<ProjectProps> = ({ id, image, description, route }) => {
  return (
    <section className="project-showcase" id={`project-${id}`}>
      <div className="project-showcase__media">
        <div className="mockup-container">
          <img
            src={laptopMockup}
            alt="Mockup de portátil"
            className="mockup-container__frame"
          />
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
        <Link to={route} className="button project-showcase__button">
          + Info
        </Link>
      </div>
    </section>
  );
};

export default Project;
