import React, { useState } from 'react';
import './Contact.scss';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export const Contact: React.FC = () => {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus]   = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('https://api.oscarpelegrina.com/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
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
            <label htmlFor="name" className="contact__label">Nombre</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Tu nombre"
              className="contact__input"
              required
              disabled={status === 'submitting'}
              value={name}
              onChange={e => setName(e.target.value)}
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
              disabled={status === 'submitting'}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="contact__field">
            <label htmlFor="message" className="contact__label">Mensaje</label>
            <textarea
              id="message"
              name="message"
              placeholder="Tu mensaje"
              className="contact__textarea"
              required
              disabled={status === 'submitting'}
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>

          {status === 'error' && (
            <p className="contact__error">
              Ha ocurrido un error al enviar el mensaje. Inténtalo de nuevo.
            </p>
          )}

          <div className="contact__actions">
            <button
              type="submit"
              className="contact__submit"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Enviando...' : 'ENVIAR'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
