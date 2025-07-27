import './AboutMe.scss'
import { AboutMeCarousel } from './AboutMeCarrusel/AboutMeCarrusel'

export const AboutMe = () => {
  return (
    <section className="about-me">
      <div className='main-container'>
        <div className="about-me-content">
          <h1 className='about-me-h1'>SOBRE MÍ</h1>
          <div className="blue-line"></div>
          <p className="description">
            Desarrollador backend especializado en Java, con conocimientos en React y un enfoque constante en la calidad, la agilidad y el aprendizaje continuo.
          </p>
        </div>

        <div className="about-me-details">
          <div className="get-know">
            <h2>¡Conóceme!</h2>
            <AboutMeCarousel />

            <button className="about-button">Contacto</button>
          </div>

          <div className="my-skills">
            <h2>Mis conocimientos</h2>
            <div className="skills-list">
              <div className="skill-item">HTML</div>
              <div className="skill-item">CSS</div>
              <div className="skill-item">JavaScript</div>
              <div className="skill-item">TypeScript</div>
              <div className="skill-item">Java</div>
              <div className="skill-item">Jakarta EE</div>
              <div className="skill-item">Spring Framework</div>
              <div className="skill-item">Hibernate</div>
              <div className="skill-item">JPA</div>
              <div className="skill-item">JUnit 5</div>
              <div className="skill-item">Docker</div>
              <div className="skill-item">Kubernetes</div>
              <div className="skill-item">React</div>
            </div>

          </div>
        </div>
      </div>
       

    </section>
  )
}
