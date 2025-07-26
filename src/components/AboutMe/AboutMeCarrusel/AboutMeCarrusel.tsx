import { useRef, useState, type JSX, type ReactNode } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'; // más alargadas y finas
import './AboutMeCarrusel.scss';

export const AboutMeCarousel = (): JSX.Element => {
  const slides: ReactNode[][] = [
    [
      <p key="p1">
        <strong>Soy desarrollador backend especializado en Java</strong>, con experiencia en microservicios y frameworks como <strong>Spring</strong> y <strong>Spring Boot</strong>.
      </p>,
      <p key="p2">
        Me enfoco en <strong>código limpio, modular y mantenible</strong>, aplicando principios como <strong>SOLID</strong> y buenas prácticas. Conozco <strong>bases de datos relacionales</strong> y uso <strong>Git</strong>.
      </p>,
    ],
    [
      <p key="p3">
        Aunque mi fortaleza está en el backend, también tengo conocimientos en frontend con <strong>React (JavaScript y TypeScript)</strong>, lo que me permite colaborar en entornos full stack.
      </p>,
      <p key="p4">
        Me considero <strong>autodidacta, proactivo y orientado al detalle</strong>. Aprendo constantemente y aplico <strong>Scrum</strong> para entregar valor colaborativo.
      </p>,
    ],
    [
      <p key="p5">
        Sé <strong>documentar procesos</strong>, escribir <strong>tests con JUnit</strong> y trabajar en equipo con una actitud <strong>camaleónica, adaptable y resolutiva</strong>.
      </p>,
      <p key="p6">
        La <strong>claridad en la comunicación</strong>, la <strong>gestión del tiempo</strong> y el <strong>feedback</strong> son claves en mi forma de trabajar.
      </p>,
    ],
  ];

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);

  const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsAnimating(false);
    }, 300);
  };

  const prev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsAnimating(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 50) prev();
    else if (diff < -50) next();
    touchStartX.current = null;
  };

  return (
    <div className="about-carousel">
      <div
        className={`slide ${isAnimating ? 'fade' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides[currentSlide]}
      </div>

      <div className="carousel-controls">
        <button onClick={prev} aria-label="Anterior">
          <IoIosArrowBack />
        </button>

        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        <button onClick={next} aria-label="Siguiente">
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};
