export type MessageType = 'user' | 'assistant';

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string; // Conteúdo extraído do arquivo ou base64 do arquivo original
  url?: string; // URL para download/visualização
  category?: string; // Categoria do arquivo (pdf, word, excel, etc.)
  originalFileName?: string; // Nome original do arquivo
  base64?: string; // Conteúdo em base64 do arquivo original
}

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  attachments?: FileAttachment[]; // Anexos opcionais
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FileUploadResponse {
  success: boolean;
  file?: FileAttachment;
  error?: string;
} 