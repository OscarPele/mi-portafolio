import React from 'react';
import './ERPMain.scss';

export const ERPMain: React.FC = () => {
  return (
    <main className="erp-main">
      <div className="erp-main__status">
        <span className="erp-main__label">ERP Workspace</span>
        <h1 className="erp-main__title">Panel principal en construccion</h1>
        <p className="erp-main__text">
          Aqui iran el nav, el sidebar y las funcionalidades internas del ERP.
        </p>
      </div>
    </main>
  );
};
