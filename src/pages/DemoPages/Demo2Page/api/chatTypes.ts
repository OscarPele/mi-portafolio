export interface ChatConversationSummary {
  id: string;
  title: string;
  counterpartUsername: string;
  lastMessagePreview: string;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  authorType: 'assistant' | 'human';
  authorUsername: string;
  authorLabel: string;
  text: string;
  sentAt: string;
}

export interface ChatConversationMessagesResponse {
  conversationId: string;
  messages: ChatMessage[];
}

export type ChatClientEvent =
  | {
    type: 'subscribe';
    conversationId: string;
  }
  | {
    type: 'send_message';
    conversationId: string;
    text: string;
  };

export type ChatServerEvent =
  | {
    type: 'conversation_list';
    conversations: ChatConversationSummary[];
  }
  | {
    type: 'assistant_pending';
    conversationId: string;
  }
  | {
    type: 'assistant_idle';
    conversationId: string;
  }
  | {
    type: 'conversation_history';
    conversationId: string;
    messages: ChatMessage[];
  }
  | {
    type: 'message_created';
    conversationId: string;
    conversation: ChatConversationSummary;
    message: ChatMessage;
  }
  | {
    type: 'error';
    code: string;
    message: string;
  };
