import {
  FaLinkedin,
  FaGithub,
  FaInstagram
} from 'react-icons/fa';
import './Footer.scss';

export const Footer = () => {
  return (
    <section className="Footer">
      <div className='Footer-main'>
       
        <div className="Footer__container">
          {/* Columna izquierda */}
          <div className="Footer__info">
            <h3 className="Footer__name">ÒSCAR PELEGRINA</h3>
          </div>

          {/* Columna derecha */}
          <div className="Footer__social">
            <h3 className="Footer__social-title">REDES SOCIALES</h3>
            <div className="Footer__social-icons">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
              
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
