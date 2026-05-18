import './Home.scss'

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
        <a href="#proyectos" className="btn btn--bg">Proyecto</a>
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
