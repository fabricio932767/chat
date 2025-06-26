"use client";

import MessageItem from '@/components/MessageItem';
import { sendMessage } from '@/services/chatService';
import { ChatSession, FileAttachment, Message } from '@/types/chat';
import { addMessageToSession, clearAllSessions, getSessions, saveSession } from '@/utils/localStorage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>(uuidv4());
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<FileAttachment[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragCounterRef = useRef(0);

  // Carregar tema quando o componente montar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkTheme(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  // Alternar entre tema claro/escuro
  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  // Carregar sessão do localStorage ao iniciar
  useEffect(() => {
    // Busca todas as sessões
    const sessions = getSessions();
    
    // Se não houver sessões ou a última estiver vazia, cria uma nova
    if (sessions.length === 0 || sessions[sessions.length - 1].messages.length === 0) {
      const newSession: ChatSession = {
        id: sessionId,
        title: 'Nova conversa',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      saveSession(newSession);
    } else {
      // Usa a última sessão
      const lastSession = sessions[sessions.length - 1];
      setSessionId(lastSession.id);
      setMessages(lastSession.messages);
    }
  }, [sessionId]);

  // Efeito para rolar para a última mensagem quando uma nova mensagem é adicionada
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Função para processar arquivo
  const processFile = async (file: File): Promise<void> => {
    console.log('processFile chamada para:', file.name); // Debug
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Enviando para API...'); // Debug
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Resposta da API:', result); // Debug

      if (result.success && result.file) {
        console.log('Arquivo processado com sucesso, adicionando aos anexos pendentes'); // Debug
        setPendingAttachments(prev => [...prev, result.file]);
      } else {
        console.error('Erro na resposta da API:', result.error); // Debug
        setUploadError(result.error || 'Erro ao processar arquivo');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      setUploadError('Erro ao enviar arquivo. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  // Função para remover anexo pendente
  const removePendingAttachment = (attachmentId: string) => {
    setPendingAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  // Funções de drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragOver(false);

    console.log('Drop detectado!', e.dataTransfer.files.length); // Debug

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      
      console.log('Arquivo detectado:', file.name, file.type); // Debug
      
      // Validar tipo de arquivo
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ];

      if (!allowedTypes.includes(file.type)) {
        setUploadError('Tipo de arquivo não suportado. Envie apenas PDF, Excel ou Word.');
        return;
      }

      // Validar tamanho (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('Arquivo muito grande. Tamanho máximo: 10MB');
        return;
      }

      console.log('Processando arquivo...'); // Debug
      processFile(file);
    }
  }, []);

  const handleSendMessage = async (content: string) => {
    if ((!content.trim() && pendingAttachments.length === 0) || isLoading) return;

    // Usar anexos pendentes para esta mensagem
    const attachments = pendingAttachments.length > 0 ? [...pendingAttachments] : undefined;

    // Criar mensagem do usuário
    const userMessage: Message = {
      id: uuidv4(),
      type: 'user',
      content,
      timestamp: new Date(),
      attachments: attachments
    };

    // Adicionar mensagem do usuário ao estado
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    // Adicionar mensagem à sessão no localStorage
    addMessageToSession(sessionId, userMessage);

    // Limpar anexos pendentes após enviar
    setPendingAttachments([]);

    // Mostrar indicador de carregamento
    setIsLoading(true);
    setIsTyping(true);
    setError(null);

    try {
      // Simular um pequeno atraso para mostrar o indicador "digitando..."
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Enviar mensagem para o servidor (incluindo anexos se existirem)
      const reply = await sendMessage(content, sessionId, attachments);

      // Criar mensagem do assistente
      const assistantMessage: Message = {
        id: uuidv4(),
        type: 'assistant',
        content: reply,
        timestamp: new Date()
      };

      // Adicionar mensagem do assistente ao estado
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      
      // Adicionar resposta à sessão no localStorage
      addMessageToSession(sessionId, assistantMessage);
    } catch (err) {
      // Mostrar mensagem de erro
      setError('Ocorreu um erro ao se comunicar com o servidor. Por favor, tente novamente.');
      console.error('Erro na comunicação com o webhook:', err);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    // Limpar todas as sessões do localStorage
    clearAllSessions();
    
    // Criar nova sessão
    const newSessionId = uuidv4();
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'Nova conversa',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Salvar e atualizar o estado
    saveSession(newSession);
    setSessionId(newSessionId);
    setMessages([]);
    setError(null);

    console.log('Chat limpo completamente. Nova sessão criada:', newSessionId);
  };

  // Enviar mensagem quando o botão for clicado
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      handleSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  // Enviar mensagem quando Enter for pressionado
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim() && !isLoading) {
        handleSendMessage(inputMessage);
        setInputMessage('');
      }
    }
  };

  return (
    <div className="container-fluid">
      <div 
        className={`chat-container ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Cabeçalho do chat */}
        <div className="chat-header">
          <div className="header-avatar">
            {/* Avatar do assistente vazio */}
          </div>
          <div className="header-info">
            <div className="header-title">Atendimento Virtual</div>
            <div className="header-status">
              {isTyping ? 'Digitando...' : 'Online'}
            </div>
          </div>
          <div className="header-actions">
            {/* Botão para alternar o tema */}
            <button 
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label={isDarkTheme ? "Modo Claro" : "Modo Escuro"}
            >
              {isDarkTheme ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sun" viewBox="0 0 16 16">
                  <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-moon" viewBox="0 0 16 16">
                  <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"/>
                </svg>
              )}
            </button>
            
            <button 
              onClick={clearChat}
              className="new-chat-btn"
              aria-label="Nova conversa"
            >
              Novo chat
            </button>
          </div>
        </div>
        
        {/* Content Area - Container com tamanho fixo */}
        <div className="content-area">
          {/* Área de mensagens - único elemento com rolagem */}
          <div className="messages-area">
            {messages.length === 0 ? (
              <div className="empty-chat">
                <div className="welcome-container">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="welcome-icon mx-auto"
                  >
                    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25a1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0a1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25a1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
                  </svg>
                  <p>Olá! Como posso ajudar você hoje?</p>
                </div>
              </div>
            ) : (
              <>
                <div className="message-list">
                  {messages.map((message) => (
                    <MessageItem key={message.id} message={message} />
                  ))}
                </div>
                
                {isTyping && (
                  <div className="typing-container message-animation">
                    <div className="avatar avatar-assistant">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                      </svg>
                    </div>
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="error-message message-animation d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="error-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    {error}
                  </div>
                )}
              </>
            )}
            {/* Referência para rolar para a última mensagem */}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Área de entrada de mensagem */}
          <div className="input-area">
            {/* Exibir anexos pendentes */}
            {pendingAttachments.length > 0 && (
              <div className="pending-attachments">
                <div className="pending-attachments-header">
                  <span>Arquivos anexados ({pendingAttachments.length}):</span>
                </div>
                <div className="pending-attachments-list">
                  {pendingAttachments.map((attachment) => (
                    <div key={attachment.id} className="pending-attachment-item">
                      <span className="attachment-name">{attachment.name}</span>
                      <button 
                        onClick={() => removePendingAttachment(attachment.id)}
                        className="remove-attachment-btn"
                        aria-label="Remover anexo"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Indicadores de upload */}
            {uploading && (
              <div className="upload-indicator">
                <div className="upload-spinner"></div>
                <span>Processando arquivo...</span>
              </div>
            )}

            {uploadError && (
              <div className="upload-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                </svg>
                <span>{uploadError}</span>
                <button onClick={() => setUploadError(null)} className="dismiss-error">×</button>
              </div>
            )}
            
            <form onSubmit={handleFormSubmit} className="input-container">
              <button className="emoji-btn" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm-4.34 7.964a.75.75 0 01-1.061-1.06 5.236 5.236 0 013.73-1.538 5.236 5.236 0 013.695 1.538.75.75 0 11-1.061 1.06 3.736 3.736 0 00-2.639-1.098 3.736 3.736 0 00-2.664 1.098z" clipRule="evenodd" />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                className="chat-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleInputKeyDown}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading || (!inputMessage.trim() && pendingAttachments.length === 0)} 
                className="send-btn"
                aria-label="Enviar mensagem"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Overlay de drag & drop */}
        {isDragOver && (
          <div className="drag-overlay">
            <div className="drag-overlay-content">
              <div className="drag-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
                </svg>
              </div>
              <div className="drag-text">
                <h3>Solte o arquivo aqui</h3>
                <p>PDF, Excel (.xlsx, .xls) ou Word (.docx)</p>
                <p>Tamanho máximo: 10MB</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer; 