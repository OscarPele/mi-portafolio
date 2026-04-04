import type { ChatConversationMessagesResponse, ChatConversationSummary } from './chatTypes';

const CHAT_API_BASE_URL = (
  import.meta.env.VITE_AI_CHAT_API_BASE_URL as string | undefined
) ?? (
  import.meta.env.VITE_API_BASE_URL as string
);

const CHAT_BASE_PATH = '/ai-chat';

async function chatAuthRequest<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  const { headers: optionHeaders, ...restOptions } = options ?? {};

  const response = await fetch(`${CHAT_API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...optionHeaders,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.code ?? body.message ?? body.error ?? response.statusText);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : (undefined as T);
}

export function getChatConversations(token: string): Promise<ChatConversationSummary[]> {
  return chatAuthRequest<ChatConversationSummary[]>(`${CHAT_BASE_PATH}/conversations`, token);
}

export function getChatConversationMessages(
  token: string,
  conversationId: string,
): Promise<ChatConversationMessagesResponse> {
  return chatAuthRequest<ChatConversationMessagesResponse>(
    `${CHAT_BASE_PATH}/conversations/${encodeURIComponent(conversationId)}/messages`,
    token,
  );
}
