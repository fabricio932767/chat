"use client";

import axios from 'axios';

// URL do webhook do n8n (configurada apenas no next.config.ts)
const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || '';

/**
 * Envia uma mensagem para o webhook do n8n e retorna a resposta
 * @param message Mensagem do usuário
 * @param sessionId ID único da sessão de conversa
 * @returns Resposta do assistente
 */
export const sendMessage = async (message: string, sessionId: string): Promise<string> => {
  try {
    if (!WEBHOOK_URL) {
      throw new Error('URL do webhook não configurada');
    }
    
    console.log('Enviando mensagem para:', WEBHOOK_URL);
    console.log('Conteúdo:', { message, sessionId });
    
    const response = await axios.post(WEBHOOK_URL, {
      message: message,
      sessionId: sessionId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Resposta recebida:', response.data);
    
    // Verificar diferentes formatos possíveis da resposta
    if (response.data) {
      // Formato esperado: { reply: "mensagem" }
      if (response.data.reply && typeof response.data.reply === 'string') {
        return response.data.reply;
      }

      // Formato vindo do N8N: { output: "mensagem" }
      if (response.data.output && typeof response.data.output === 'string') {
        return response.data.output;
      }
      
      // Formato alternativo: { response: "mensagem" }
      if (response.data.response && typeof response.data.response === 'string') {
        return response.data.response;
      }
      
      // Formato alternativo: { message: "mensagem" }
      if (response.data.message && typeof response.data.message === 'string') {
        return response.data.message;
      }
      
      // Se for uma string direta
      if (typeof response.data === 'string') {
        return response.data;
      }
      
      // Se for um objeto, mas não tem os campos esperados
      if (typeof response.data === 'object') {
        // Tentar extrair o primeiro campo string do objeto, EXCLUINDO 'output' se já foi tratado
        for (const key in response.data) {
          if (key !== 'output' && typeof response.data[key] === 'string') {
            return response.data[key];
          }
        }
        
        // Se não encontrar campo string, retornar o objeto como string
        return JSON.stringify(response.data);
      }
    }
    
    console.error('Formato de resposta não reconhecido:', response.data);
    throw new Error('Formato de resposta inválido');
  } catch (error) {
    console.error('Erro ao enviar mensagem para o webhook:', error);
    
    // Log detalhado do erro
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Headers:', error.response?.headers);
    }
    
    throw error;
  }
}; 