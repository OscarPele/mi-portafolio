import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthProvider, useAuth } from '../Demo1Page/context/AuthContext';
import type { ChatMessage } from './api/chatTypes';
import { useDemo2Chat } from './hooks/useDemo2Chat';
import './Demo2Page.scss';

const tags = ['React', 'TypeScript', 'WebSocket', 'Spring Boot', 'DeepSeek API', 'Docker'];

function formatTimeLabel(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

function Demo2ChatContent() {
  const { token, currentUser } = useAuth();
  const {
    activeConversation,
    activeConversationId,
    assistantPendingConversationIds,
    canSendMessages,
    conversations,
    error,
    isBootstrapping,
    isLoadingMessages,
    isOscar,
    messages,
    selectConversation,
    sendMessage,
    socketState,
  } = useDemo2Chat({ token, currentUser });

  const [draft, setDraft] = useState('');
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const isAssistantPending = activeConversationId
    ? assistantPendingConversationIds.has(activeConversationId)
    : false;

  useEffect(() => {
    if (!messagesRef.current) {
      return;
    }

    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, isLoadingMessages]);

  const composerPlaceholder = useMemo(() => {
    if (!token || !currentUser) {
      return 'Inicia sesion en la demo 1 para poder escribir.';
    }

    if (!activeConversationId) {
      return isOscar
        ? 'Selecciona una conversacion para responder.'
        : 'Todavia no hay una conversacion disponible.';
    }

    if (socketState !== 'connected') {
      return 'Conectando con AIChat...';
    }

    return isOscar
      ? 'Escribe una respuesta para el usuario seleccionado...'
      : 'Escribe un mensaje para Oscar...';
  }, [activeConversationId, currentUser, isOscar, socketState, token]);

  const helperMessage = useMemo(() => {
    if (!token || !currentUser) {
      return 'Necesitas iniciar sesion en la demo 1 para abrir un chat personal.';
    }

    if (!activeConversationId) {
      return isOscar
        ? 'Aun no hay conversaciones disponibles para Oscar.'
        : 'No se pudo crear tu conversacion personal.';
    }

    if (socketState !== 'connected') {
      return 'Conectando con AIChat...';
    }

    return null;
  }, [activeConversationId, currentUser, isOscar, socketState, token]);

  const getMessageVariant = (message: ChatMessage) => {
    if (message.authorType === 'assistant') {
      return 'assistant';
    }

    const normalizedCurrentUsername = currentUser?.username.trim().toLowerCase();
    const normalizedAuthorUsername = message.authorUsername.trim().toLowerCase();

    if (normalizedCurrentUsername && normalizedCurrentUsername === normalizedAuthorUsername) {
      return 'self';
    }

    if (normalizedAuthorUsername === 'oscar') {
      return 'oscar';
    }

    return 'guest';
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedDraft = draft.trim();

    if (!trimmedDraft || !canSendMessages) {
      return;
    }

    if (sendMessage(trimmedDraft)) {
      setDraft('');
    }
  };

  return (
    <div className="demo2-chat-page">
      <header className="demo2-chat-page__banner">
        <div className="demo2-chat-page__banner-content">
          <span className="demo2-chat-page__category">Full-Stack</span>
          <h1 className="demo2-chat-page__title">Chat en tiempo real con Oscar y su IA</h1>
          <p className="demo2-chat-page__description">
            El acceso al chat queda vinculado a la sesion de la demo 1. Cada usuario abre una
            conversacion personal y, cuando inicia sesion Oscar, aparece una interfaz de
            operador para responder en tiempo real mientras DeepSeek genera las respuestas del asistente.
          </p>
        </div>
      </header>

      <main className="demo2-chat-page__main">
        <section>
          <h2 className="demo2-chat-page__section-title">Tecnologias</h2>
          <ul className="demo2-chat-page__tags">
            {tags.map(tag => (
              <li key={tag} className="demo2-chat-page__tag">{tag}</li>
            ))}
          </ul>
        </section>

        <section className="demo2-chat-page__demo-section">
          <h2 className="demo2-chat-page__section-title">Demo</h2>

          <div className={`demo2-chat-page__workspace${isOscar ? ' demo2-chat-page__workspace--operator' : ''}`}>
            {isOscar ? (
              <aside className="demo2-chat-page__conversation-list">
                <div className="demo2-chat-page__conversation-list-header">
                  <h3 className="demo2-chat-page__conversation-list-title">Conversaciones</h3>
                </div>

                <div className="demo2-chat-page__conversation-items">
                  {isBootstrapping ? (
                    <p className="demo2-chat-page__empty-state">Cargando conversaciones...</p>
                  ) : conversations.length === 0 ? (
                    <p className="demo2-chat-page__empty-state">
                      Oscar no tiene conversaciones activas todavia.
                    </p>
                  ) : (
                    conversations.map(conversation => (
                      <button
                        key={conversation.id}
                        type="button"
                        className={`demo2-chat-page__conversation-item${conversation.id === activeConversationId ? ' demo2-chat-page__conversation-item--active' : ''}`}
                        onClick={() => selectConversation(conversation.id)}
                      >
                        <strong className="demo2-chat-page__conversation-item-title">
                          {conversation.title}
                        </strong>
                        <span className="demo2-chat-page__conversation-item-preview">
                          {conversation.lastMessagePreview || 'Sin mensajes todavia'}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </aside>
            ) : null}

            <div className="demo2-chat-page__chat-shell">
              <div className="demo2-chat-page__chat-header">
                <h3 className="demo2-chat-page__chat-title">Conversacion</h3>
              </div>

              <div
                ref={messagesRef}
                className="demo2-chat-page__messages"
                aria-live="polite"
              >
                {!token || !currentUser ? (
                  <div className="demo2-chat-page__gate">
                    <p className="demo2-chat-page__gate-text">
                      Inicia sesion primero en la demo 1 para abrir un chat personal y autenticado.
                    </p>
                    <Link to="/demos/1" className="demo2-chat-page__gate-link">
                      Ir a la demo 1
                    </Link>
                  </div>
                ) : isBootstrapping ? (
                  <p className="demo2-chat-page__empty-state">Cargando chat...</p>
                ) : isLoadingMessages ? (
                  <p className="demo2-chat-page__empty-state">Cargando mensajes...</p>
                ) : messages.length === 0 ? (
                  <p className="demo2-chat-page__empty-state">
                    {isOscar
                      ? 'Selecciona una conversacion y espera el primer mensaje del usuario.'
                      : 'Tu conversacion esta lista. Envia el primer mensaje.'}
                  </p>
                ) : (
                  messages.map(message => {
                    const variant = getMessageVariant(message);

                    return (
                      <div
                        key={message.id}
                        className={`demo2-chat-page__message-row demo2-chat-page__message-row--${variant}`}
                      >
                        <article className={`demo2-chat-page__message demo2-chat-page__message--${variant}`}>
                          <div className="demo2-chat-page__message-meta">
                            <strong>{message.authorLabel}</strong>
                            <span>{formatTimeLabel(message.sentAt)}</span>
                          </div>
                          <p className="demo2-chat-page__message-text">{message.text}</p>
                        </article>
                      </div>
                    );
                  })
                )}

                {isAssistantPending ? (
                  <div className="demo2-chat-page__message-row demo2-chat-page__message-row--assistant">
                    <article className="demo2-chat-page__message demo2-chat-page__message--assistant demo2-chat-page__message--typing">
                      <div className="demo2-chat-page__message-meta">
                        <strong>IA de Oscar</strong>
                        <span>Ahora</span>
                      </div>
                      <div className="demo2-chat-page__typing">
                        <span />
                        <span />
                        <span />
                      </div>
                    </article>
                  </div>
                ) : null}
              </div>

              <form className="demo2-chat-page__composer" onSubmit={handleSubmit}>
                <label className="demo2-chat-page__composer-label" htmlFor="demo2-chat-input">
                  Mensaje
                </label>
                <textarea
                  id="demo2-chat-input"
                  className="demo2-chat-page__composer-input"
                  placeholder={composerPlaceholder}
                  value={draft}
                  onChange={event => setDraft(event.target.value)}
                  disabled={!canSendMessages}
                />

                {helperMessage ? (
                  <p className="demo2-chat-page__composer-hint">{helperMessage}</p>
                ) : null}

                {error ? (
                  <p className="demo2-chat-page__composer-error">{error}</p>
                ) : null}

                {activeConversation && isOscar ? (
                  <p className="demo2-chat-page__composer-context">
                    Conversacion activa con @{activeConversation.counterpartUsername}
                  </p>
                ) : null}

                <div className="demo2-chat-page__composer-footer">
                  <button
                    type="submit"
                    className="demo2-chat-page__send-button"
                    disabled={!canSendMessages || !draft.trim()}
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export const Demo2Page: React.FC = () => (
  <AuthProvider>
    <Demo2ChatContent />
  </AuthProvider>
);
