import React from 'react';
import { useParams } from 'react-router-dom';
import rawProjectsData from '../../components/Projects/ProjectsData.json';
import { images } from '../../components/Projects/projects-images/projects-images';
import './OverviewProjectPage.scss';
import laptopMockup from '../../assets/jpeg/project-mockup-example.svg';


interface ProjectData {
  id: number;
  route: string;
  image: string;
  description: string;
  title: string;
  intro: string;
  liveLink: string;
  codeLink: string;
  overview: string[];
  tools: string[];
}

export const OverviewProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = (rawProjectsData as ProjectData[]).find(
    p => p.id === Number(id)
  );

  if (!project) {
    return <p>Proyecto no encontrado.</p>;
  }

  return (
    <div className="overview-page">
      {/* --- Banner superior --- */}
      <header className="overview-banner">
        <div className="overview-banner__content">
          <h1 className="overview-banner__title">{project.title}</h1>
          <p className="overview-banner__intro">{project.intro}</p>
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="button overview-banner__button"
          >
            VER PROYECTO
          </a>
        </div>
      </header>

      
        {/* --- Mockup de pantalla --- */}
        <div className="overview-mockup">
          <div className="mockup-container">
            {/* Marco del portátil */}
            <img
              src={laptopMockup}
              alt="Mockup de portátil"
              className="mockup-container__frame"
            />
            {/* Captura dentro de la pantalla */}
            <img
              src={images[project.image]}
              alt={`Captura de ${project.title}`}
              className="mockup-container__screen"
            />
          </div>
        </div>

      <div className='overview-main'>
        {/* --- Sección “Project Overview” --- */}
        <section className="overview-section">
          <h2 className="overview-section__heading">Descripción general del proyecto</h2>
          {project.overview.map((text, idx) => (
            <p key={idx} className="overview-section__text">
              {text}
            </p>
          ))}
        </section>

        {/* --- Sección “Tools Used” --- */}
        <section className="tools-section">
          <h2 className="tools-section__heading">Herramientas utilizadas</h2>
          <ul className="tools-section__list">
            {project.tools.map(tool => (
              <li key={tool} className="tools-section__item">
                {tool}
              </li>
            ))}
          </ul>
        </section>

        {/* --- Sección “See Live” --- */}
        <section className="see-live-section">
          <h2 className="see-live-section__heading">Ver en vivo</h2>
          <div className="see-live-section__buttons">
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="button-live"
            >
              VER PROYECTO
            </a>
            <a
              href={project.codeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="button-code"
            >
              VER CÓDIGO
            </a>
          </div>
        </section>
      </div>

    </div>
  );
};
