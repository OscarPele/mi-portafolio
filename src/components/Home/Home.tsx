import './Home.scss'


export const Home = () => {
  return (
    <section className="home">
      <h1 className="home__title">Hola, soy Oscar, amante del código limpio.</h1>
      <p className="home__subtitle">O eso quiero pensar.</p>
      <p className="home__description">
        Con constancia, iniciativa y compromiso, transformo requisitos
        complejos en APIs y servicios seguros y escalables, garantizando
        siempre un código de calidad.
      </p>
      <button className="home__button">PROJECTS</button>
    </section>
  );
};

