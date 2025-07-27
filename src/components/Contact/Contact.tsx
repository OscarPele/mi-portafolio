import React, { useState, type FormEvent } from 'react';
import './Contact.scss'

export const Contact: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log({ name, email, message });
  };

  return (
    <section className="contact">
      <div className='contact-main'>

        <div className="contact__header">
          <h2 className="contact__title">CONTACTO</h2>
          <hr className="contact__divider" />
          <p className="contact__description">
            Estoy listo para nuevos desafíos. No dudes en contactarme si tienes alguna pregunta o necesitas más detalles. ¡Con gusto te responderé!</p>
        </div>

        <form onSubmit={handleSubmit} className="contact__form">
          <div className="contact__field">
            <label htmlFor="name" className="contact__label">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="contact__input"
              required
            />
          </div>

          <div className="contact__field">
            <label htmlFor="email" className="contact__label">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu Email"
              className="contact__input"
              required
            />
          </div>

          <div className="contact__field">
            <label htmlFor="message" className="contact__label">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tu mensaje"
              className="contact__textarea"
              required
            />
          </div>

          <div className="contact__actions">
            <button type="submit" className="contact__submit">ENVIAR</button>
          </div>
        </form>
      </div>
    </section>
  );
};
