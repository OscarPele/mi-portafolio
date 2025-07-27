import './Home.scss'
/* Imports de iconos */
import linkedinIcon from '../../assets/png/linkedin-ico.png';
import githubIcon from '../../assets/png/github-ico.png';
import instaIcon from '../../assets/png/insta-ico.png';


export const Home = () => (
  <section id="inicio" className="home-hero">
    {/* Contenido centrado */}
    <div className="home-hero__content">
      <h1 className="heading-primary"> Hola, soy Oscar, amante del código limpio.</h1>
      <div className="home-hero__info">
        <p className="text-primary">
          Con constancia, iniciativa y compromiso, busco transformar requisitos complejos en APIs y servicios seguros y escalables, garantizando siempre un código de calidad.
        </p>
      </div>
      <div className="home-hero__cta">
        <a href="#proyectos" className="btn btn--bg">Proyectos</a>
      </div>
    </div>

    {/* Iconos sociales fijos al lateral */}
    <div className="home-hero__socials">
      <div className="home-hero__social">
        <a href="#" className="home-hero__social-icon-link">
          <img src={linkedinIcon} alt="LinkedIn" className="home-hero__social-icon" />
        </a>
      </div>
      <div className="home-hero__social">
        <a href="#" className="home-hero__social-icon-link">
          <img src={githubIcon} alt="GitHub" className="home-hero__social-icon" />
        </a>
      </div>
      <div className="home-hero__social">
        <a href="#" className="home-hero__social-icon-link home-hero__social-icon-link--bd-none">
          <img src={instaIcon} alt="Instagram" className="home-hero__social-icon" />
        </a>
      </div>
    </div>


    {/* Indicador de scroll */}
    <div className="home-hero__mouse-scroll-cont">
      <div className="mouse">
        <div className="scroll-dot"></div>
      </div>
    </div>

  </section>
);
