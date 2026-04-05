import React, { useState } from 'react';
import './Demo4Page.scss';

// ── Data ─────────────────────────────────────────────────────────────────────

const tags = [
  'Docker',
  'Docker Compose',
  'Cloudflare Tunnel',
  'Multi-stage Build',
  'Spring Boot',
  'Java 23',
];

type InfraType = 'docker' | 'compose' | 'tunnel' | 'spring';

interface InfraDoc {
  type: InfraType;
  label: string;
  title: string;
  summary: string;
  description: string;
  code: string;
  detail: string;
}

const infraDocs: InfraDoc[] = [
  {
    type: 'docker',
    label: 'Dockerfile',
    title: 'Multi-stage build',
    summary: 'Maven build → JRE runtime — imagen final sin herramientas de compilación',
    description:
      'El Dockerfile usa dos etapas separadas. La primera descarga las dependencias offline y compila el JAR con Maven. La segunda parte del JRE mínimo de Eclipse Temurin 23 y copia únicamente el artefacto final. Resultado: una imagen de producción sin Maven, sin código fuente y con la superficie de ataque reducida al mínimo.',
    code: `FROM maven:3.9.9-eclipse-temurin-23 AS build

WORKDIR /app

# Copia el wrapper y el pom antes que el código fuente.
# Si el pom.xml no cambia, Docker reutiliza esta capa en caché.
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw -q -DskipTests dependency:go-offline

COPY src/ src/
RUN ./mvnw -q -DskipTests package

# ── Runtime ──────────────────────────────────────────────────
FROM eclipse-temurin:23-jre

WORKDIR /app
COPY --from=build /app/target/*SNAPSHOT.jar /app/app.jar

EXPOSE 3000
ENTRYPOINT ["java", "-jar", "/app/app.jar"]`,
    detail:
      'La separación de capas es intencional: si solo cambia el código fuente sin tocar el pom.xml, Docker reutiliza la capa de descarga de dependencias. Esto reduce el tiempo de build de ~85 s (primera vez, cold cache) a ~5 s en builds sucesivos.',
  },
  {
    type: 'compose',
    label: 'Docker Compose',
    title: 'Orquestación de servicios',
    summary: 'backend + cloudflared en un stack declarativo con restart automático',
    description:
      'docker-compose.yml define dos servicios: el backend Spring Boot y el agente de Cloudflare Tunnel. El backend lee su configuración desde el .env del host y arranca con el perfil Spring prod. El servicio cloudflared solo necesita el token del tunnel y se conecta automáticamente a los edge servers de Cloudflare. Ambos tienen restart: always, lo que garantiza que se relancen solos si el proceso cae o el host reinicia.',
    code: `services:
  backend:
    build: .
    env_file:
      - .env
    environment:
      SERVER_PORT: "3000"
      SPRING_PROFILES_ACTIVE: prod
      # host.docker.internal apunta al Mac anfitrión (PostgreSQL local)
      SPRING_DATASOURCE_URL: jdbc:postgresql://host.docker.internal:5432/portfolioBackend_DB
      APP_VERIFY_EMAIL_SUCCESS_URL: https://oscarpelegrina.com/demos/1?emailVerified=1
      APP_VERIFY_EMAIL_ERROR_URL: https://oscarpelegrina.com/demos/1?emailVerifyError=1
    ports:
      - "3000:3000"
    restart: always

  cloudflared:
    image: cloudflare/cloudflared:2026.2.0
    depends_on:
      - backend
    command:
      - tunnel
      - --no-autoupdate
      - run
      - --token
      - \${CLOUDFLARE_TUNNEL_TOKEN}
    restart: always`,
    detail:
      'host.docker.internal permite al contenedor acceder a la PostgreSQL que corre en el Mac anfitrión sin exponer la base de datos al exterior. El servicio cloudflared declara depends_on: backend para esperar a que el backend esté en pie antes de iniciar el tunnel.',
  },
  {
    type: 'tunnel',
    label: 'Cloudflare Tunnel',
    title: 'Exposición sin puertos abiertos',
    summary: 'api.oscarpelegrina.com → backend:3000 sin IP pública ni reglas de router',
    description:
      'cloudflared establece conexiones QUIC salientes hacia los edge servers de Cloudflare. No se abre ningún puerto de entrada en el router ni se necesita una IP pública estática. Cloudflare recibe las peticiones HTTPS en api.oscarpelegrina.com y las retransmite al contenedor a través del tunnel. El certificado TLS, la protección DDoS y el CDN los gestiona Cloudflare de forma completamente transparente.',
    code: `# Regla de ingress configurada en el panel Cloudflare Zero Trust
# Hostname                  → Service
# api.oscarpelegrina.com    → http://backend:3000

# cloudflared mantiene 4 conexiones simultáneas (redundancia):
Registered tunnel connection connIndex=0  location=mad05  protocol=quic
Registered tunnel connection connIndex=1  location=mad06  protocol=quic
Registered tunnel connection connIndex=2  location=mad06  protocol=quic
Registered tunnel connection connIndex=3  location=mad05  protocol=quic

# Si una conexión cae, el tráfico se redistribuye automáticamente.`,
    detail:
      'Los 4 conectores apuntan a dos PoPs distintos de Madrid (mad05, mad06) para alta disponibilidad. El protocolo QUIC multiplexado sobre UDP reduce la latencia en comparación con TCP, especialmente en condiciones de red con pérdida de paquetes.',
  },
  {
    type: 'spring',
    label: 'Spring Boot Actuator',
    title: 'Health endpoint — /health',
    summary: 'Monitorización del estado del backend accesible públicamente',
    description:
      'Spring Boot Actuator expone un endpoint de salud en /health sin autenticación. El base-path del actuator se configura en / para que la URL sea directa, y solo se exponen health e info para minimizar la superficie de exposición. Este endpoint lo puede consultar cualquier monitor externo, Cloudflare Health Checks o el propio equipo para verificar el estado del despliegue.',
    code: `# application.yml
management:
  endpoints:
    web:
      base-path: /            # /health en lugar de /actuator/health
      exposure:
        include: health,info  # solo estos dos endpoints expuestos
  endpoint:
    health:
      show-details: never     # no filtra info interna a usuarios anónimos

# Comprobación real del endpoint en producción:
$ curl https://api.oscarpelegrina.com/health
{"status":"UP"}`,
    detail:
      'show-details: never evita exponer información sensible (estado de la BD, uso de memoria) a usuarios no autenticados. El endpoint es suficiente para cualquier sistema de monitorización externo y para confirmar que el despliegue fue exitoso.',
  },
];

interface DeployStep {
  n: number;
  title: string;
  detail: string;
  code?: string;
}

const deploySteps: DeployStep[] = [
  {
    n: 1,
    title: 'Modificar el código localmente',
    detail:
      'Se editan archivos del backend en local. Pueden ser nuevos endpoints, cambios de configuración o dependencias en el pom.xml.',
  },
  {
    n: 2,
    title: 'Reconstruir y relanzar',
    detail:
      'Un único comando reconstruye la imagen Docker con el código actualizado y relanza el contenedor. El servicio cloudflared no se reinicia.',
    code: 'docker compose up --build -d',
  },
  {
    n: 3,
    title: 'Maven compila en caché',
    detail:
      'Si el pom.xml no cambió, Docker reutiliza la capa de dependencias. Solo se recompila el código fuente (~5 s en lugar de ~85 s en cold cache).',
  },
  {
    n: 4,
    title: 'Spring Boot arranca',
    detail:
      'El contenedor nuevo inicia con el perfil prod, conecta a PostgreSQL y registra todos los endpoints y el WebSocket. El tunnel de Cloudflare empieza a enrutar tráfico al nuevo contenedor automáticamente.',
    code: 'Started PortfolioBackendApplication in 4.25 seconds (process running for 4.598)',
  },
  {
    n: 5,
    title: 'Disponible en producción',
    detail:
      'El backend actualizado está operativo en api.oscarpelegrina.com. El health check confirma el estado antes de dar el despliegue por completado.',
    code: '$ curl https://api.oscarpelegrina.com/health\n{"status":"UP"}',
  },
];

// ── Components ────────────────────────────────────────────────────────────────

function InfraBadge({ type, label }: { type: InfraType; label: string }) {
  return (
    <span className={`ci-infra-badge ci-infra-badge--${type}`}>{label}</span>
  );
}

function InfraCard({ doc }: { doc: InfraDoc }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`oa-card${open ? ' oa-card--open' : ''}`}>
      <button
        type="button"
        className="oa-card__header"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div className="oa-card__header-left">
          <InfraBadge type={doc.type} label={doc.label} />
          <code className="oa-card__path">{doc.title}</code>
          <span className="oa-card__summary">{doc.summary}</span>
        </div>
        <span className={`oa-card__chevron${open ? ' oa-card__chevron--up' : ''}`} aria-hidden>▾</span>
      </button>

      {open && (
        <div className="oa-card__body">
          <p className="oa-card__description">{doc.description}</p>

          <div className="oa-card__section">
            <h4 className="oa-card__section-title">Configuración</h4>
            <pre className="oa-pre"><code>{doc.code}</code></pre>
          </div>

          <div className="oa-card__service-box">
            <span className="oa-card__service-label">Detalle de diseño</span>
            <p className="oa-card__service-note">{doc.detail}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function DeployStepRow({ step }: { step: DeployStep }) {
  return (
    <div className="ci-step">
      <div className="ci-step__number">{step.n}</div>
      <div className="ci-step__content">
        <h4 className="ci-step__title">{step.title}</h4>
        <p className="ci-step__detail">{step.detail}</p>
        {step.code && (
          <pre className="oa-pre"><code>{step.code}</code></pre>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export const Demo4Page: React.FC = () => {
  return (
    <div className="oa-page">
      <header className="oa-page__banner">
        <div className="oa-page__banner-content">
          <span className="oa-page__category">DevOps</span>
          <h1 className="oa-page__title">Despliegue con Docker &amp; Cloudflare Tunnel</h1>
          <p className="oa-page__description">
            Backend en producción corriendo en un Mac mini local, expuesto de forma segura mediante
            un Cloudflare Tunnel sin abrir puertos ni contratar una VPS. Cero coste de
            infraestructura adicional.
          </p>
        </div>
      </header>

      <main className="oa-page__main">

        <section>
          <h2 className="oa-page__section-title">Tecnologías</h2>
          <ul className="oa-page__tags">
            {tags.map(tag => (
              <li key={tag} className="oa-page__tag">{tag}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="oa-page__section-title">Por qué este enfoque</h2>
          <div className="ci-rationale">
            <div className="ci-rationale__item">
              <span className="ci-rationale__icon">⬡</span>
              <div>
                <strong>Sin VPS</strong>
                <p>El backend corre en hardware propio. No hay cuota mensual de servidor, y los recursos disponibles (RAM, CPU, disco) son mayores que los de un VPS económico.</p>
              </div>
            </div>
            <div className="ci-rationale__item">
              <span className="ci-rationale__icon">⬡</span>
              <div>
                <strong>Sin puertos abiertos</strong>
                <p>Cloudflare Tunnel establece conexiones salientes hacia el edge de Cloudflare. El router doméstico no necesita ninguna regla de reenvío y la IP pública nunca queda expuesta.</p>
              </div>
            </div>
            <div className="ci-rationale__item">
              <span className="ci-rationale__icon">⬡</span>
              <div>
                <strong>TLS y DDoS gratis</strong>
                <p>Cloudflare gestiona el certificado SSL/TLS, la terminación HTTPS y la protección contra DDoS de forma automática para cualquier dominio registrado en su red.</p>
              </div>
            </div>
            <div className="ci-rationale__item">
              <span className="ci-rationale__icon">⬡</span>
              <div>
                <strong>Despliegue en un comando</strong>
                <p>Un solo <code>docker compose up --build -d</code> reconstruye la imagen y relanza el backend en segundos gracias a la caché de capas de Docker.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="oa-page__section-title">Componentes de infraestructura</h2>
          <p className="oa-page__section-lead">
            Cada componente documenta su configuración real y la decisión de diseño detrás de ella.
            Haz clic en cualquier tarjeta para expandirla.
          </p>
          <div className="ci-infra-legend">
            <InfraBadge type="docker" label="Dockerfile" />  imagen de build y runtime
            <InfraBadge type="compose" label="Docker Compose" />  orquestación
            <InfraBadge type="tunnel" label="Cloudflare Tunnel" />  red y TLS
            <InfraBadge type="spring" label="Spring Boot" />  configuración de app
          </div>
          <div className="oa-cards">
            {infraDocs.map(doc => (
              <InfraCard key={doc.title} doc={doc} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="oa-page__section-title">Flujo de despliegue</h2>
          <p className="oa-page__section-lead">
            Secuencia completa desde el cambio de código hasta que el backend está disponible en
            producción, con los tiempos y outputs reales de cada paso.
          </p>
          <div className="ci-steps">
            {deploySteps.map(step => (
              <DeployStepRow key={step.n} step={step} />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};
