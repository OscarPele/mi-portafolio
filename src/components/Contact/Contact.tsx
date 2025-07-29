import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import './Contact.scss';

type FormFields = {
  name: string;
  email: string;
  message: string;
};

export const Contact: React.FC = () => {
  const [state, handleSubmit] = useForm<FormFields>("mdkdzbrb");

  if (state.succeeded) {
    return (
      <section id="contacto" className="contact">
        <div className="contact-main">
          <div className="contact__thankyou contact__thankyou--visible">
            <h2 className="contact__thankyou-title">¡Gracias por tu mensaje!</h2>
            <p className="contact__thankyou-text">Te responderé lo antes posible.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contacto" className="contact">
      <div className="contact-main">
        <div className="contact__header">
          <h2 className="contact__title">CONTACTO</h2>
          <hr className="contact__divider" />
          <p className="contact__description">
            Estoy listo para nuevos desafíos. No dudes en contactarme si tienes alguna pregunta o necesitas más detalles. ¡Con gusto te responderé!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="contact__form">
          <div className="contact__field">
            <label htmlFor="name" className="contact__label">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Tu nombre"
              className="contact__input"
              required
              disabled={state.submitting}
            />
            <ValidationError 
              prefix="Name" 
              field="name"
              errors={state.errors}
            />
          </div>

          <div className="contact__field">
            <label htmlFor="email" className="contact__label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Tu email"
              className="contact__input"
              required
              disabled={state.submitting}
            />
            <ValidationError 
              prefix="Email" 
              field="email"
              errors={state.errors}
            />
          </div>

          <div className="contact__field">
            <label htmlFor="message" className="contact__label">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Tu mensaje"
              className="contact__textarea"
              required
              disabled={state.submitting}
            />
            <ValidationError 
              prefix="Message" 
              field="message"
              errors={state.errors}
            />
          </div>

          {Array.isArray(state.errors) && state.errors.length > 0 && (
            <p className="contact__error">
              {state.errors.map((error, i) => (
                <span key={i}>{error.message}</span>
              ))}
            </p>
          )}

          <div className="contact__actions">
            <button
              type="submit"
              className="contact__submit"
              disabled={state.submitting}
            >
              {state.submitting ? 'Enviando...' : 'ENVIAR'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
