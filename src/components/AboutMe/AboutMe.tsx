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

            <button type="button">Contact</button>
          </div>

          <div className="my-skills">
            <h2>Mis habilidades</h2>
            <div className="skills-list">
              <div className="skill-item">HTML</div>
              <div className="skill-item">CSS</div>
              <div className="skill-item">JavaScript</div>
            </div>
          </div>
        </div>
      </div>
       

    </section>
  )
}
