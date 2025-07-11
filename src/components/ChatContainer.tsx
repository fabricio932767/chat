"use client";

import ChatHeader from '@/components/ChatHeader';
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
  const inputRef = useRef<HTMLInputElement>(null); // Ref para o input

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

  // Função para focar no input de forma robusta
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      // Múltiplas tentativas para garantir o foco
      const tryFocus = () => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus();
          // Mover cursor para o final do texto (se houver)
          const length = inputRef.current.value.length;
          inputRef.current.setSelectionRange(length, length);
        }
      };

      // Tentativas imediatas e com delays
      tryFocus();
      
      setTimeout(tryFocus, 10);
      setTimeout(tryFocus, 50);
      setTimeout(tryFocus, 100);
      setTimeout(tryFocus, 200);
      
      // Tentativa final após animações
      setTimeout(tryFocus, 500);
    }
  }, []);

  // Focar no input quando o componente montar
  useEffect(() => {
    // Aguardar um pouco para garantir que o componente esteja totalmente renderizado
    const timer = setTimeout(() => {
      focusInput();
    }, 500);

    return () => clearTimeout(timer);
  }, [focusInput]);

  // Focar no input quando o loading terminar
  useEffect(() => {
    if (!isLoading) {
      // Aguardar um pouco para garantir que as animações terminem
      const timer = setTimeout(() => {
        focusInput();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isLoading, focusInput]);

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
      
      // Validar tipo de arquivo - expandido para incluir mais formatos
      const allowedTypes = [
        // PDFs
        'application/pdf',
        // Word
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/msword', // .doc
        // Excel
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        // Texto
        'text/plain', // .txt
        'text/csv', // .csv
        // RTF
        'application/rtf', // .rtf
        'text/rtf', // .rtf (alternativo)
        // PowerPoint
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
        'application/vnd.ms-powerpoint', // .ppt
        // Imagens
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/tiff'
      ];

      // Verificação flexível baseada na extensão
      const fileName = file.name.toLowerCase();
      const allowedExtensions = [
        '.pdf', '.docx', '.doc', '.xlsx', '.xls', '.txt', '.csv', '.rtf', 
        '.pptx', '.ppt', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'
      ];
      
      const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

      if (!allowedTypes.includes(file.type) && !hasValidExtension) {
        setUploadError('Tipo de arquivo não suportado. Envie: PDF, Word, Excel, PowerPoint, TXT, CSV, RTF ou imagens.');
        return;
      }

      // Validar tamanho (50MB - atualizado para suportar documentos maiores)
      if (file.size > 50 * 1024 * 1024) {
        setUploadError('Arquivo muito grande. Tamanho máximo: 50MB');
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
      
      // Garantir que o foco retorne ao input após o envio
      setTimeout(() => {
        focusInput();
      }, 100);
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
    if ((inputMessage.trim() || pendingAttachments.length > 0) && !isLoading) {
      handleSendMessage(inputMessage);
      setInputMessage('');
      // Focar no input após enviar usando a função robusta
      focusInput();
    }
  };

  // Enviar mensagem quando Enter for pressionado
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if ((inputMessage.trim() || pendingAttachments.length > 0) && !isLoading) {
        handleSendMessage(inputMessage);
        setInputMessage('');
        // Focar no input após enviar usando a função robusta
        focusInput();
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
        {/* Cabeçalho do chat - componente modular */}
        <ChatHeader 
          isDarkTheme={isDarkTheme}
          isTyping={isTyping}
          onToggleTheme={toggleTheme}
          onClearChat={clearChat}
        />
        
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
            
            {/* Input hidden para upload */}
            <input
              id="file-input"
              type="file"
              accept=".pdf,.docx,.doc,.xlsx,.xls,.txt,.csv,.rtf,.pptx,.ppt,.jpg,.jpeg,.png,.gif,.bmp,.tiff"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  processFile(file);
                }
                // Limpar o input para permitir upload do mesmo arquivo novamente
                e.target.value = '';
              }}
            />
            
            <form onSubmit={handleFormSubmit} className="input-container">
              <input
                ref={inputRef}
                type="text"
                placeholder="Digite sua mensagem..."
                className="chat-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleInputKeyDown}
                disabled={isLoading}
                autoFocus
              />
              
              {/* Botão para anexar arquivo */}
              <button 
                type="button"
                onClick={() => {
                  const fileInput = document.getElementById('file-input');
                  if (fileInput) {
                    fileInput.click();
                  }
                }}
                className="attachment-btn"
                aria-label="Anexar arquivo"
                title="Anexar arquivo (PDF, Word, Excel, TXT, CSV, RTF, PowerPoint, Imagens)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                </svg>
              </button>
              
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
                <p>PDF, Word, Excel, TXT, CSV, RTF, PowerPoint, Imagens</p>
                <p>Tamanho máximo: 50MB</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer; 