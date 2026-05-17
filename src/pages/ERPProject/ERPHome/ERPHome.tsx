import React from 'react';
import './ERPHome.scss';

export const ERPHome: React.FC = () => {
  return (
    <main className="erp-home">
      <div className="erp-home__status">
        <span className="erp-home__label">ERP Project</span>
        <h1 className="erp-home__title">Pagina de acceso en construccion</h1>
        <p className="erp-home__text">
          Aqui ira el login y el registro del ERP.
        </p>
      </div>
    </main>
  );
};
