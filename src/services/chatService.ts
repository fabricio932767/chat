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
    
    // Determinar o objeto de dados real, caso a resposta seja um array
    let dataToProcess = response.data;
    if (Array.isArray(response.data) && response.data.length > 0) {
      dataToProcess = response.data[0];
      console.log('Processando primeiro elemento do array de resposta:', dataToProcess);
    } else if (Array.isArray(response.data) && response.data.length === 0) {
      console.error('Resposta recebida é um array vazio.');
      throw new Error('Resposta do webhook é um array vazio.');
    }

    // Verificar diferentes formatos possíveis da resposta usando dataToProcess
    if (dataToProcess) {
      // Formato esperado: { reply: "mensagem" }
      if (dataToProcess.reply && typeof dataToProcess.reply === 'string') {
        return dataToProcess.reply;
      }

      // Formato vindo do N8N: { output: "mensagem" }
      if (dataToProcess.output && typeof dataToProcess.output === 'string') {
        return dataToProcess.output;
      }
      
      // Formato alternativo: { response: "mensagem" }
      if (dataToProcess.response && typeof dataToProcess.response === 'string') {
        return dataToProcess.response;
      }
      
      // Formato alternativo: { text: "mensagem" } // Adicionando de volta para cobrir mais casos
      if (dataToProcess.text && typeof dataToProcess.text === 'string') {
        return dataToProcess.text;
      }
      
      // Formato alternativo: { message: "mensagem" }
      if (dataToProcess.message && typeof dataToProcess.message === 'string') {
        return dataToProcess.message;
      }
      
      // Se for uma string direta (pouco provável se dataToProcess era um objeto de um array)
      if (typeof dataToProcess === 'string') {
        return dataToProcess;
      }
      
      // Se for um objeto, mas não tem os campos esperados
      if (typeof dataToProcess === 'object') {
        // Tentar extrair o primeiro campo string do objeto
        for (const key in dataToProcess) {
          if (typeof dataToProcess[key] === 'string') {
            // Evitar retornar chaves que não são a mensagem principal, como 'sessionId' etc.
            // Esta heurística pode precisar de ajuste se houverem outras strings no objeto.
            if (key !== 'output' && key !== 'reply' && key !== 'response' && key !== 'text' && key !== 'message') {
               // Poderia adicionar uma lógica mais inteligente aqui se necessário
            }
            return dataToProcess[key]; 
          }
        }
        
        // Se não encontrar campo string, retornar o objeto como string
        return JSON.stringify(dataToProcess);
      }
    }
    
    console.error('Formato de resposta não reconhecido:', response.data); // Logar a resposta original
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