import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Demo1Page.scss';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthDemo from './Auth/AuthDemo';
import AuthMessageModal from './Auth/AuthMessageModal';
import { TasksPage } from './Tasks/TasksPage';

const tags = ['React', 'TypeScript', 'Spring Boot', 'Spring Security', 'JWT', 'JavaMail', 'PostgreSQL'];

function DemoSection() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <TasksPage /> : <AuthDemo />;
}

export const Demo1Page: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [modal, setModal] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    if (searchParams.get('emailVerified') === '1') {
      setModal({
        title: 'Correo verificado',
        message: 'Tu cuenta ha sido activada correctamente. Ya puedes iniciar sesion.',
      });
      setSearchParams({}, { replace: true });
    } else if (searchParams.get('emailVerifyError') === '1') {
      setModal({
        title: 'Error de verificacion',
        message: 'El enlace no es valido o ha caducado. Puedes solicitar un nuevo correo de verificacion.',
      });
      setSearchParams({}, { replace: true });
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthProvider>
      <div>
        <header className="demo-page__banner">
          <div className="demo-page__banner-content">
            <span className="demo-page__category">Full-Stack</span>
            <h1 className="demo-page__title">Auth &amp; Tasks</h1>
            <p className="demo-page__description">
              Flujo completo de autenticación con verificación de email y CRUD de tareas.
              Registro, confirmación de correo, login y gestión de tareas desde una misma app.
              Las rutas están protegidas en React: un usuario no autenticado no puede acceder
              a zonas restringidas y es redirigido automáticamente al login.
            </p>
          </div>
        </header>

        <main className="demo-page__main">
          <section>
            <h2 className="demo-page__section-title">Tecnologías</h2>
            <ul className="demo-page__tags">
              {tags.map(tag => (
                <li key={tag} className="demo-page__tag">{tag}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="demo-page__section-title">Demo</h2>
            <DemoSection />
          </section>
        </main>

        <AuthMessageModal
          open={modal !== null}
          title={modal?.title ?? ''}
          message={modal?.message ?? ''}
          actionLabel="Entendido"
          onAction={() => setModal(null)}
        />
      </div>
    </AuthProvider>
  );
};
