import { FileAttachment } from '@/types/chat';
import { SSLConfig } from '@/utils/sslConfig';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

// URL do webhook do N8N
const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || 'https://n8ndev.intranet.wdcnet/webhook/chat-test';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 API Route: Recebendo requisição do frontend...');
    
    // Extrair dados do body da requisição
    const body = await request.json();
    const { message, sessionId, attachments } = body;
    
    console.log('📨 Dados recebidos:', { message, sessionId, attachmentsCount: attachments?.length || 0 });
    
    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Mensagem e sessionId são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Preparar payload para o N8N
    const payload: Record<string, unknown> = {
      message: message,
      sessionId: sessionId
    };

    // Incluir informações dos anexos se existirem
    if (attachments && attachments.length > 0) {
      console.log('📎 Processando anexos para envio ao N8N...');
      
      payload.attachments = attachments.map((att: FileAttachment) => ({
        id: att.id,
        name: att.name,
        type: att.type,
        size: att.size,
        content: att.content
      }));
      
      // Criar uma mensagem informativa sobre os documentos anexados
      let enhancedMessage = `${message}\n\n`;
      
      // Adicionar contexto sobre os documentos
      enhancedMessage += `📎 DOCUMENTOS ANEXADOS:\n`;
      
      attachments.forEach((att: FileAttachment, index: number) => {
        enhancedMessage += `\n${index + 1}. DOCUMENTO: "${att.name}"\n`;
        enhancedMessage += `   Tipo: ${att.type}\n`;
        enhancedMessage += `   Categoria: ${att.category || 'unknown'}\n`;
        enhancedMessage += `   Tamanho: ${(att.size / 1024).toFixed(1)} KB\n`;
        enhancedMessage += `   Status: Arquivo original anexado em base64 para processamento\n`;
        enhancedMessage += `   ID: ${att.id}\n`;
      });
      
      enhancedMessage += `\n📝 INSTRUÇÕES PARA O N8N:\n`;
      enhancedMessage += `- Os arquivos estão disponíveis em base64 no campo 'attachments'\n`;
      enhancedMessage += `- Use o campo 'category' para identificar o tipo de processamento necessário\n`;
      enhancedMessage += `- Processe o arquivo conforme a solicitação do usuário\n`;
      enhancedMessage += `- Extraia texto, dados ou informações conforme necessário\n`;
      
      payload.fullMessage = enhancedMessage;
      
      console.log('📄 Mensagem estruturada criada:', {
        originalMessage: message,
        attachmentCount: attachments.length,
        fullMessageLength: enhancedMessage.length
      });
    }
    
    console.log('🌐 Enviando para N8N:', WEBHOOK_URL);
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));
    
    // Configurar agente HTTPS com certificado SSL
    let httpsAgent = undefined;
    
    try {
      httpsAgent = SSLConfig.createHttpsAgent();
      console.log('🔒 Agente HTTPS configurado:', httpsAgent ? 'Sim' : 'Não');
    } catch (error) {
      console.error('⚠️  Erro ao criar agente HTTPS:', error);
    }
    
    // Fazer requisição para o webhook do N8N
    let response;
    
    try {
      response = await axios.post(WEBHOOK_URL, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000,
        ...(httpsAgent && { httpsAgent })
      });
    } catch (sslError: unknown) {
      // Se falhou com SSL e estamos em desenvolvimento, tentar sem verificação SSL
      if (process.env.NODE_ENV === 'development' && 
          ((sslError as { code?: string }).code === 'SELF_SIGNED_CERT_IN_CHAIN' || 
           (sslError as { code?: string }).code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' ||
           (sslError as { code?: string }).code === 'DEPTH_ZERO_SELF_SIGNED_CERT' ||
           (sslError as { message?: string }).message?.includes('certificate'))) {
        
        console.warn('🔓 Erro SSL detectado, tentando novamente sem verificação SSL...');
        console.warn('   Código do erro:', (sslError as { code?: string }).code);
        console.warn('   Mensagem:', (sslError as { message?: string }).message);
        
        // Criar agente que ignora SSL
        const insecureAgent = new (await import('https')).Agent({
          rejectUnauthorized: false
        });
        
        response = await axios.post(WEBHOOK_URL, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 30000,
          httpsAgent: insecureAgent
        });
        
        console.log('✅ Conexão bem-sucedida com SSL desabilitado (desenvolvimento)');
      } else {
        // Re-lançar o erro se não for relacionado a SSL ou não estivermos em desenvolvimento
        throw sslError;
      }
    }
    
    console.log('✅ Resposta do N8N recebida:');
    console.log('   Status:', response.status);
    console.log('   Data:', JSON.stringify(response.data, null, 2));
    
    // Processar resposta do N8N
    let dataToProcess = response.data;
    console.log('🔍 Tipo da resposta do N8N:', typeof dataToProcess);
    console.log('🔍 Conteúdo da resposta:', dataToProcess);
    
    if (Array.isArray(response.data) && response.data.length > 0) {
      dataToProcess = response.data[0];
      console.log('📋 Extraído primeiro item do array:', dataToProcess);
    } else if (Array.isArray(response.data) && response.data.length === 0) {
      console.warn('⚠️  Resposta do webhook é um array vazio, usando mensagem padrão');
      dataToProcess = null;
    }

    // Extrair mensagem da resposta
    let assistantMessage = '';
    
    if (dataToProcess) {
      if (dataToProcess.reply && typeof dataToProcess.reply === 'string') {
        assistantMessage = dataToProcess.reply;
      } else if (dataToProcess.output && typeof dataToProcess.output === 'string') {
        assistantMessage = dataToProcess.output;
      } else if (dataToProcess.response && typeof dataToProcess.response === 'string') {
        assistantMessage = dataToProcess.response;
      } else if (dataToProcess.text && typeof dataToProcess.text === 'string') {
        assistantMessage = dataToProcess.text;
      } else if (dataToProcess.message && typeof dataToProcess.message === 'string') {
        assistantMessage = dataToProcess.message;
      } else if (typeof dataToProcess === 'string') {
        assistantMessage = dataToProcess;
      } else if (typeof dataToProcess === 'object') {
        // Tentar extrair o primeiro campo string do objeto
        for (const key in dataToProcess) {
          if (typeof dataToProcess[key] === 'string' && 
              !['sessionId', 'id', 'timestamp'].includes(key)) {
            assistantMessage = dataToProcess[key];
            break;
          }
        }
        
        // Se não encontrar, retornar o objeto como string
        if (!assistantMessage) {
          assistantMessage = JSON.stringify(dataToProcess);
        }
      }
    }
    
    // Tratar respostas vazias ou inválidas do N8N
    if (!assistantMessage || assistantMessage.trim() === '') {
      console.warn('⚠️  Resposta vazia do N8N, usando mensagem padrão');
      assistantMessage = 'Olá! Recebi sua mensagem. O sistema de IA está funcionando, mas parece que houve um problema na geração da resposta. Tente enviar sua pergunta novamente.';
    }
    
    console.log('📤 Enviando resposta para o frontend:', assistantMessage);
    
    return NextResponse.json({
      success: true,
      reply: assistantMessage,
      originalResponse: response.data
    });
    
  } catch (error) {
    console.error('❌ Erro na API route do chat:', error);
    
    // Log detalhado do erro
    if (axios.isAxiosError(error)) {
      console.error('   Axios Error Details:');
      console.error('   - Status:', error.response?.status);
      console.error('   - Data:', error.response?.data);
      console.error('   - Code:', error.code);
      console.error('   - Message:', error.message);
      
      // Erros específicos de SSL
      if (error.code === 'SELF_SIGNED_CERT_IN_CHAIN' || 
          error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' ||
          error.code === 'DEPTH_ZERO_SELF_SIGNED_CERT') {
        return NextResponse.json({
          error: 'Erro de certificado SSL. Configure o certificado rootCA.crt em /certs/',
          details: error.message,
          solution: 'Execute: npm run test:ssl para diagnóstico',
          code: error.code
        }, { status: 500 });
      }
      
      if (error.code === 'ENOTFOUND') {
        return NextResponse.json({
          error: 'Endpoint N8N não encontrado. Verifique se você está na rede interna.',
          details: error.message
        }, { status: 502 });
      }
      
      if (error.code === 'ECONNREFUSED') {
        return NextResponse.json({
          error: 'Conexão recusada pelo servidor N8N.',
          details: error.message
        }, { status: 502 });
      }
      
      if (error.code === 'ETIMEDOUT') {
        return NextResponse.json({
          error: 'Timeout na conexão com o N8N.',
          details: error.message
        }, { status: 504 });
      }
    }
    
    return NextResponse.json({
      error: 'Erro interno do servidor',
      details: (error as Error).message
    }, { status: 500 });
  }
} 