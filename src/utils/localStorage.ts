import { ChatSession, Message } from '@/types/chat';

const STORAGE_KEY = 'chat-n8n-sessions';

/**
 * Verifica se o localStorage está disponível
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    const testKey = '__test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Obtém todas as sessões de chat armazenadas
 */
export const getSessions = (): ChatSession[] => {
  if (!isLocalStorageAvailable()) return [];
  
  try {
    const storedSessions = window.localStorage.getItem(STORAGE_KEY);
    return storedSessions ? JSON.parse(storedSessions) : [];
  } catch (error) {
    console.error('Erro ao obter sessões do localStorage:', error);
    return [];
  }
};

/**
 * Obtém uma sessão específica pelo ID
 */
export const getSessionById = (sessionId: string): ChatSession | null => {
  if (!isLocalStorageAvailable()) return null;
  
  const sessions = getSessions();
  return sessions.find(session => session.id === sessionId) || null;
};

/**
 * Salva uma sessão no localStorage
 */
export const saveSession = (session: ChatSession): void => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    const sessions = getSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      // Atualiza a sessão existente
      sessions[existingIndex] = {
        ...session,
        updatedAt: new Date()
      };
    } else {
      // Adiciona nova sessão
      sessions.push(session);
    }
    
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Erro ao salvar sessão no localStorage:', error);
  }
};

/**
 * Remove uma sessão do localStorage
 */
export const deleteSession = (sessionId: string): void => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    const sessions = getSessions().filter(session => session.id !== sessionId);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Erro ao remover sessão do localStorage:', error);
  }
};

/**
 * Adiciona uma mensagem a uma sessão
 */
export const addMessageToSession = (sessionId: string, message: Message): void => {
  if (!isLocalStorageAvailable()) return;
  
  const session = getSessionById(sessionId);
  if (!session) return;
  
  session.messages.push(message);
  session.updatedAt = new Date();
  
  saveSession(session);
};

/**
 * Remove todas as sessões do localStorage
 */
export const clearAllSessions = (): void => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar todas as sessões do localStorage:', error);
  }
}; 