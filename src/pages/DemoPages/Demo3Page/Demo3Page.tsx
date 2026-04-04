import React from 'react';
import './Demo3Page.scss';

const tags = ['Spring Boot', 'OpenAPI', 'Swagger UI', 'JUnit', 'MockMvc', 'Integration Testing'];

export const Demo3Page: React.FC = () => {
  return (
    <div>
      <header className="demo-page__banner">
        <div className="demo-page__banner-content">
          <span className="demo-page__category">Backend</span>
          <h1 className="demo-page__title">OpenAPI &amp; Testing</h1>
          <p className="demo-page__description">
            API documentada con OpenAPI/Swagger y acompañada por tests de unidad e integracion
            orientados a validar la logica de negocio y los endpoints criticos.
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
              Aqui se mostrara la documentacion generada, la estructura de endpoints y los tests clave del backend.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};
