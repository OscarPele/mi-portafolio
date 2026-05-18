import React from 'react';
import './Education.scss';

interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  description: string;
}

const educationData: EducationItem[] = [
  {
    institution: 'LinkiaFP',
    degree: 'Ciclo Superior — Desarrollo de Aplicaciones Web',
    period: '2024 – 2026',
    description:
      'Formación oficial de grado superior centrada en el desarrollo web full stack: HTML, CSS, JavaScript, PHP, bases de datos relacionales, despliegue en servidores y fundamentos de programación orientada a objetos.',
  },
  {
    institution: 'Conquer Blocks',
    degree: 'Curso — Desarrollo Web Full Stack',
    period: '2024',
    description:
      'Curso intensivo orientado a la práctica con tecnologías modernas: React, Node.js, APIs REST, autenticación, bases de datos y despliegue en la nube.',
  },
];

export const Education: React.FC = () => {
  return (
    <section className="education">
      <div id="estudios" className="education-main-container">
        <div className="education-content">
          <h1 className="education-h1">ESTUDIOS</h1>
          <div className="blue-line" />
        </div>

        <div className="education-grid">
          {educationData.map((item) => (
            <div key={item.institution} className="education-card">
              <div className="education-card-header">
                <span className="education-dot" />
                <div>
                  <h2 className="education-institution">{item.institution}</h2>
                  <p className="education-degree">{item.degree}</p>
                  <p className="education-period">{item.period}</p>
                </div>
              </div>
              <p className="education-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
