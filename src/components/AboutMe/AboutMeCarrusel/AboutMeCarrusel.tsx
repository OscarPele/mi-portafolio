import {
  useRef,
  useState,
  useEffect,
  type JSX,
  type ReactNode,
} from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import './AboutMeCarrusel.scss';

export const AboutMeCarousel = (): JSX.Element => {
  const slides: ReactNode[][] = [
  [
    <p key="p1">
      <strong>Soy desarrollador backend especializado en Java</strong>, con conocimientos en el desarrollo de microservicios y en el uso de frameworks como <strong>Spring</strong> y <strong>Spring Boot</strong> para crear aplicaciones robustas y escalables.
    </p>,
    <p key="p2">
      Me enfoco en escribir <strong>código limpio, modular y mantenible</strong>, aplicando principios como <strong>SOLID</strong>, buenas prácticas y patrones de diseño. Tengo experiencia con <strong>bases de datos relacionales</strong> y uso habitual de <strong>Git</strong> para el control de versiones.
    </p>,
  ],
  [
    <p key="p3">
      Aunque mi fortaleza principal está en el backend, también cuento con conocimientos en frontend mediante <strong>React</strong>, utilizando tanto <strong>JavaScript</strong> como <strong>TypeScript</strong>, lo que me permite colaborar eficientemente en entornos full stack y comprender la experiencia de usuario.
    </p>,
    <p key="p4">
      Me considero autodidacta, proactivo y orientado al detalle. Disfruto del aprendizaje continuo y aplico metodologías ágiles como <strong>Scrum</strong> para organizar proyectos y mejorar mi productividad de forma iterativa.
    </p>,
  ],
  [
    <p key="p5">
      He documentado procesos técnicos en proyectos personales y he escrito tests con <strong>JUnit</strong>, desarrollando una actitud camaleónica, adaptable y resolutiva que me ayuda a aprender rápidamente nuevas tecnologías.
    </p>,
    <p key="p6">
      Valoro la <strong>claridad en la comunicación</strong>, la <strong>responsabilidad en la gestión del tiempo</strong> y la <strong>apertura al feedback</strong> como pilares fundamentales para crecer y colaborar de manera efectiva.
    </p>,
  ],
];


  const [currentSlide, setCurrentSlide] = useState(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const isAnimating = useRef(false);
  const touchStartX = useRef<number | null>(null);

  const measureMaxHeight = () => {
    const heights = slideRefs.current.map((el) => el?.offsetHeight ?? 0);
    const max = Math.max(...heights);
    setContainerHeight(max);
  };

  useEffect(() => {
    measureMaxHeight();
    window.addEventListener('resize', measureMaxHeight);
    return () => window.removeEventListener('resize', measureMaxHeight);
  }, []);

  const next = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      isAnimating.current = false;
    }, 300);
  };

  const prev = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      isAnimating.current = false;
    }, 300);
  };

  const goToSlide = (index: number) => {
    if (isAnimating.current || index === currentSlide) return;
    isAnimating.current = true;
    setTimeout(() => {
      setCurrentSlide(index);
      isAnimating.current = false;
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
    <div className="about-carousel" style={{ minHeight: `${containerHeight}px` }} ref={wrapperRef}>
      <div className="carousel-slides">
        {slides.map((content, i) => (
          <div
            key={i}
            ref={(el) => {slideRefs.current[i] = el}}
            className={`slide ${i === currentSlide ? 'active' : ''}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {content}
          </div>
        ))}
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
