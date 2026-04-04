import { useEffect, useMemo, useRef, useState } from 'react';
import { getChatConversationMessages, getChatConversations } from '../api/chatApi';
import { createChatSocket, sendChatSocketEvent } from '../api/chatSocket';
import type { ChatConversationSummary, ChatMessage, ChatServerEvent } from '../api/chatTypes';

interface ChatViewer {
  uid: number;
  username: string;
}

interface UseDemo2ChatOptions {
  token: string | null;
  currentUser: ChatViewer | null;
}

type SocketState = 'disconnected' | 'connecting' | 'connected';

function sortConversations(conversations: ChatConversationSummary[]) {
  return [...conversations].sort((left, right) => {
    const leftTime = left.lastMessageAt ? new Date(left.lastMessageAt).getTime() : 0;
    const rightTime = right.lastMessageAt ? new Date(right.lastMessageAt).getTime() : 0;
    return rightTime - leftTime;
  });
}

function upsertConversation(
  conversations: ChatConversationSummary[],
  nextConversation: ChatConversationSummary,
) {
  const remaining = conversations.filter(conversation => conversation.id !== nextConversation.id);
  return sortConversations([nextConversation, ...remaining]);
}

function upsertMessage(messages: ChatMessage[], nextMessage: ChatMessage) {
  if (messages.some(message => message.id === nextMessage.id)) {
    return messages;
  }

  return [...messages, nextMessage];
}

export function useDemo2Chat({ token, currentUser }: UseDemo2ChatOptions) {
  const [conversations, setConversations] = useState<ChatConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [assistantPendingConversationIds, setAssistantPendingConversationIds] = useState<Set<string>>(new Set());
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [socketState, setSocketState] = useState<SocketState>('disconnected');
  const [error, setError] = useState('');

  const socketRef = useRef<WebSocket | null>(null);
  const activeConversationIdRef = useRef<string | null>(null);

  const isOscar = useMemo(
    () => currentUser?.username.trim().toLowerCase() === 'oscar',
    [currentUser?.username],
  );

  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  useEffect(() => {
    if (!token || !currentUser) {
      setConversations([]);
      setActiveConversationId(null);
      setMessages([]);
      setAssistantPendingConversationIds(new Set());
      setIsBootstrapping(false);
      setIsLoadingMessages(false);
      setSocketState('disconnected');
      setError('');
      return;
    }

    let ignore = false;

    setIsBootstrapping(true);
    setError('');

    getChatConversations(token)
      .then(nextConversations => {
        if (ignore) {
          return;
        }

        const sortedConversations = sortConversations(nextConversations);
        setConversations(sortedConversations);
        setActiveConversationId(currentActiveConversationId => {
          if (
            currentActiveConversationId
            && sortedConversations.some(conversation => conversation.id === currentActiveConversationId)
          ) {
            return currentActiveConversationId;
          }

          return sortedConversations[0]?.id ?? null;
        });
      })
      .catch((fetchError: unknown) => {
        if (ignore) {
          return;
        }

        setConversations([]);
        setActiveConversationId(null);
        setError(fetchError instanceof Error
          ? fetchError.message
          : 'No se pudieron cargar las conversaciones.');
      })
      .finally(() => {
        if (!ignore) {
          setIsBootstrapping(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [token, currentUser]);

  useEffect(() => {
    if (!token || !activeConversationId) {
      setMessages([]);
      return;
    }

    let ignore = false;

    setIsLoadingMessages(true);

    getChatConversationMessages(token, activeConversationId)
      .then(response => {
        if (!ignore) {
          setMessages(response.messages);
        }
      })
      .catch((fetchError: unknown) => {
        if (ignore) {
          return;
        }

        setError(fetchError instanceof Error
          ? fetchError.message
          : 'No se pudo cargar la conversacion seleccionada.');
      })
      .finally(() => {
        if (!ignore) {
          setIsLoadingMessages(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [token, activeConversationId]);

  useEffect(() => {
    if (!token || !currentUser) {
      return;
    }

    const socket = createChatSocket(token);
    socketRef.current = socket;
    setSocketState('connecting');

    socket.onopen = () => {
      setSocketState('connected');
      setError('');

      if (activeConversationIdRef.current) {
        sendChatSocketEvent(socket, {
          type: 'subscribe',
          conversationId: activeConversationIdRef.current,
        });
      }
    };

    socket.onmessage = rawEvent => {
      const event = JSON.parse(rawEvent.data) as ChatServerEvent;

      if (event.type === 'conversation_list') {
        const sortedConversations = sortConversations(event.conversations);
        setConversations(sortedConversations);
        setActiveConversationId(currentActiveConversationId => {
          if (
            currentActiveConversationId
            && sortedConversations.some(conversation => conversation.id === currentActiveConversationId)
          ) {
            return currentActiveConversationId;
          }

          return sortedConversations[0]?.id ?? null;
        });
        return;
      }

      if (event.type === 'assistant_pending') {
        setAssistantPendingConversationIds(currentIds => new Set(currentIds).add(event.conversationId));
        return;
      }

      if (event.type === 'assistant_idle') {
        setAssistantPendingConversationIds(currentIds => {
          const nextIds = new Set(currentIds);
          nextIds.delete(event.conversationId);
          return nextIds;
        });
        return;
      }

      if (event.type === 'conversation_history') {
        if (event.conversationId === activeConversationIdRef.current) {
          setMessages(event.messages);
        }
        return;
      }

      if (event.type === 'message_created') {
        setConversations(currentConversations => upsertConversation(
          currentConversations,
          event.conversation,
        ));

        if (event.conversationId === activeConversationIdRef.current) {
          setMessages(currentMessages => upsertMessage(currentMessages, event.message));
        }

        if (event.message.authorType === 'assistant') {
          setAssistantPendingConversationIds(currentIds => {
            const nextIds = new Set(currentIds);
            nextIds.delete(event.conversationId);
            return nextIds;
          });
        }
        return;
      }

      if (event.type === 'error') {
        setError(event.message);
      }
    };

    socket.onerror = () => {
      setError('No se pudo establecer la conexion websocket con AIChat.');
    };

    socket.onclose = () => {
      setSocketState('disconnected');

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };

    return () => {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
      socket.close();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [token, currentUser]);

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN || !activeConversationId) {
      return;
    }

    sendChatSocketEvent(socket, {
      type: 'subscribe',
      conversationId: activeConversationId,
    });
  }, [activeConversationId]);

  const activeConversation = useMemo(
    () => conversations.find(conversation => conversation.id === activeConversationId) ?? null,
    [activeConversationId, conversations],
  );

  const canSendMessages = Boolean(
    token
    && currentUser
    && activeConversationId
    && socketState === 'connected',
  );

  const sendMessage = (text: string) => {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN || !activeConversationIdRef.current) {
      setError('La conexion websocket no esta lista para enviar mensajes.');
      return false;
    }

    sendChatSocketEvent(socket, {
      type: 'send_message',
      conversationId: activeConversationIdRef.current,
      text,
    });
    return true;
  };

  return {
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
    selectConversation: setActiveConversationId,
    sendMessage,
    socketState,
  };
}
