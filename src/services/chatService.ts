"use client";

import { FileAttachment } from '@/types/chat';
import axios from 'axios';

/**
 * Envia uma mensagem para a API route local, que se comunica com o webhook do N8N
 * @param message Mensagem do usuário
 * @param sessionId ID único da sessão de conversa
 * @param attachments Anexos opcionais (arquivos processados)
 * @returns Resposta do assistente
 */
export const sendMessage = async (
  message: string, 
  sessionId: string, 
  attachments?: FileAttachment[]
): Promise<string> => {
  try {
    console.log('=== FRONTEND: ENVIANDO MENSAGEM ===');
    console.log('Mensagem:', message);
    console.log('Session ID:', sessionId);
    console.log('Anexos:', attachments?.length || 0);
    
    // Preparar payload para a API route local
    const payload = {
      message: message,
      sessionId: sessionId,
      ...(attachments && attachments.length > 0 && { attachments })
    };
    
    console.log('📤 Enviando para API route local...');
    
    // Fazer requisição para a API route local (sem SSL, pois é localhost)
    const response = await axios.post('/api/chat', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 35000, // Timeout um pouco maior para dar tempo do servidor processar
    });
    
    console.log('✅ Resposta recebida da API route:');
    console.log('   Status:', response.status);
    console.log('   Data:', response.data);
    
    // Verificar se a resposta foi bem-sucedida
    if (response.data.success && response.data.reply) {
      return response.data.reply;
    } else if (response.data.error) {
      throw new Error(response.data.error);
    } else {
      throw new Error('Formato de resposta inválido da API route');
    }
    
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error);
    
    // Tratamento específico de erros
    if (axios.isAxiosError(error)) {
      console.error('   Axios Error Details:');
      console.error('   - Status:', error.response?.status);
      console.error('   - Data:', error.response?.data);
      console.error('   - Code:', error.code);
      
      // Se houver uma mensagem de erro específica da API route
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      // Erros de rede/timeout
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Não foi possível conectar com o servidor. Verifique se a aplicação está rodando.');
      }
      
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('Timeout na comunicação com o servidor. Tente novamente.');
      }
      
      // Erro genérico de rede
      if (error.message === 'Network Error') {
        throw new Error('Erro de rede. Verifique sua conexão com a internet.');
      }
    }
    
    // Se chegou até aqui, relançar o erro original
    throw error;
  }
}; 