import React from 'react';
import './Demo4Page.scss';

const tags = ['GitHub Actions', 'Docker', 'Nginx', 'CI/CD', 'Shell'];

export const Demo4Page: React.FC = () => {
  return (
    <div>
      <header className="demo-page__banner">
        <div className="demo-page__banner-content">
          <span className="demo-page__category">Backend</span>
          <h1 className="demo-page__title">CI/CD — Portfolio</h1>
          <p className="demo-page__description">
            Pipeline de integración y despliegue continuo que mantiene este portfolio
            actualizado en producción de forma automática tras cada push.
          </p>
        </div>
      </header>

      <main className="demo-page__main">
        <section>
          <h2 className="demo-page__section-title">Tecnologías</h2>
          <ul className="demo-page__tags">
            {tags.map(tag => (
              <li key={tag} className="demo-page__tag">{tag}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="demo-page__section-title">Demo</h2>
          <div className="demo-page__placeholder">
            <span className="demo-page__placeholder-label">En construcción</span>
            <p className="demo-page__placeholder-text">
              Aquí se mostrará el pipeline CI/CD con sus fases: build, test, push de imagen Docker y despliegue automático.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};
