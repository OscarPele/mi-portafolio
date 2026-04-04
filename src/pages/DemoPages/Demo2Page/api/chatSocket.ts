import type { ChatClientEvent } from './chatTypes';

const CHAT_API_BASE_URL = (
  import.meta.env.VITE_AI_CHAT_API_BASE_URL as string | undefined
) ?? (
  import.meta.env.VITE_API_BASE_URL as string
);

function getWebSocketBaseUrl() {
  const explicitWsBaseUrl = (
    import.meta.env.VITE_AI_CHAT_WS_BASE_URL as string | undefined
  ) ?? (
    import.meta.env.VITE_WS_BASE_URL as string | undefined
  );

  if (explicitWsBaseUrl) {
    return explicitWsBaseUrl;
  }

  const apiUrl = new URL(CHAT_API_BASE_URL);
  apiUrl.protocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';
  apiUrl.pathname = '';
  apiUrl.search = '';
  apiUrl.hash = '';

  return apiUrl.toString();
}

export function createChatSocket(token: string) {
  const url = new URL('/ws/ai-chat', getWebSocketBaseUrl());
  url.searchParams.set('token', token);
  return new WebSocket(url.toString());
}

export function sendChatSocketEvent(socket: WebSocket, event: ChatClientEvent) {
  socket.send(JSON.stringify(event));
}
