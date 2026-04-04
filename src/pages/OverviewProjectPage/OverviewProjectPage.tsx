import React from 'react';
import { useParams } from 'react-router-dom';
import rawProjectsData from '../../components/Projects/ProjectsData.json';
import './OverviewProjectPage.scss';

interface ProjectData {
  id: number;
  title: string;
  category: string;
  demonstrates: string;
  description: string;
  tags: string[];
  liveLink: string;
  codeLink: string;
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
      <header className="overview-banner">
        <div className="overview-banner__content">
          <h1 className="overview-banner__title">{project.title}</h1>
          <p className="overview-banner__intro">{project.description}</p>
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

      <div className="overview-main">
        <section className="tools-section">
          <h2 className="tools-section__heading">Herramientas utilizadas</h2>
          <ul className="tools-section__list">
            {project.tags.map(tag => (
              <li key={tag} className="tools-section__item">
                {tag}
              </li>
            ))}
          </ul>
        </section>

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
              VER CODIGO
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
