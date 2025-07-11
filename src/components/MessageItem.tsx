"use client";

import { Message } from '@/types/chat';
import MessageAttachments from './MessageAttachments';
import MarkdownRenderer from './MarkdownRenderer';
import { useEffect, useState } from 'react';

interface MessageItemProps {
  message: Message;
}

const MessageItem = ({ message }: MessageItemProps) => {
  const isUser = message.type === 'user';
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Detectar tema atual baseado no atributo data-theme do documento
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkTheme(theme === 'dark');
    };

    // Verificar tema inicial
    checkTheme();

    // Observar mudanças no tema
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);
  
  return (
    <div className={`message-item ${isUser ? 'message-user' : 'message-assistant'}`}>
      {/* Avatar para mensagens do assistente */}
      {!isUser && (
        <div className="avatar avatar-assistant">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      
      {/* Conteúdo da mensagem */}
      <div className={`message-bubble ${isUser ? 'bubble-user' : 'bubble-assistant'}`}>
        {/* Anexos (se existirem) */}
        {message.attachments && message.attachments.length > 0 && (
          <MessageAttachments attachments={message.attachments} />
        )}
        
        {/* Conteúdo de texto com suporte a markdown */}
        {message.content && (
          <MarkdownRenderer 
            content={message.content} 
            isDarkTheme={isDarkTheme}
          />
        )}
      </div>
      
      {/* Avatar para mensagens do usuário */}
      {isUser && (
        <div className="avatar avatar-user">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default MessageItem; 