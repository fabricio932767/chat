"use client";

import { FileAttachment } from '@/types/chat';
import FileUpload from './FileUpload';

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  onFormSubmit: (e: React.FormEvent) => void;
  onInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  pendingAttachments: FileAttachment[];
  onFileProcessed: (attachment: FileAttachment) => void;
  onRemoveAttachment: (attachmentId: string) => void;
  uploadError: string | null;
  onClearUploadError: () => void;
  uploading: boolean;
}

const MessageInput = ({
  inputMessage,
  setInputMessage,
  onSendMessage,
  onFormSubmit,
  onInputKeyDown,
  isLoading,
  pendingAttachments,
  onFileProcessed,
  onRemoveAttachment,
  uploadError,
  onClearUploadError,
  uploading
}: MessageInputProps) => {
  return (
    <div className="input-area">
      {/* Anexos pendentes */}
      {pendingAttachments.length > 0 && (
        <div className="pending-attachments">
          <div className="pending-attachments-header">
            📎 Arquivos a enviar ({pendingAttachments.length})
          </div>
          <div className="pending-attachments-list">
            {pendingAttachments.map((attachment) => (
              <div key={attachment.id} className="pending-attachment-item">
                <div className="attachment-name">{attachment.name}</div>
                <button
                  onClick={() => onRemoveAttachment(attachment.id)}
                  className="remove-attachment-btn"
                  aria-label="Remover anexo"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Componente de upload de arquivos */}
      <FileUpload 
        onFileProcessed={onFileProcessed}
        isDisabled={uploading || isLoading}
      />

      {/* Erro de upload */}
      {uploadError && (
        <div className="upload-error">
          <span>❌ {uploadError}</span>
          <button 
            onClick={onClearUploadError}
            className="dismiss-error"
            aria-label="Fechar erro"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Formulário de entrada de mensagem */}
      <form onSubmit={onFormSubmit} className="input-container">
        <div className="d-flex align-items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Digite sua mensagem..."
            className="chat-input flex-grow-1"
            disabled={isLoading}
          />
          <button 
            type="submit"
            className="send-btn"
            disabled={isLoading || (!inputMessage.trim() && pendingAttachments.length === 0)}
            onClick={onSendMessage}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              fill="currentColor" 
              className="bi bi-send" 
              viewBox="0 0 16 16"
            >
              <path d="m15.854.146a.5.5 0 0 1 .11.54L13.026 8.03 15.964 15.368a.5.5 0 0 1-.11.54.5.5 0 0 1-.57.05L2.378 10.053a.5.5 0 0 1 0-.9l12.906-5.905a.5.5 0 0 1 .57.05z"/>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput; 