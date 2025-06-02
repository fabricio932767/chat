# Integração Front-End com N8N

Este documento explica como a interface do chat se comunica com o servidor n8n através de webhooks.

## Visão Geral da Integração

A interface do chat em React/Next.js envia mensagens para um webhook no n8n, que processa a mensagem e retorna uma resposta que é exibida no chat.

```
Frontend (React) <---> Webhook (n8n) <---> Serviços (Ollama, banco de dados, etc.)
```

## Configuração do Webhook no Front-End

A comunicação com o webhook é configurada no arquivo `src/services/chatService.ts`:

```typescript
import axios from 'axios';

// URL correta do webhook do n8n
const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || 'https://n8n.afeera.com.br/webhook/expressao';

export const sendMessage = async (message: string, sessionId: string): Promise<string> => {
  try {
    const response = await axios.post(WEBHOOK_URL, {
      message: message,
      sessionId: sessionId
    });
    
    if (response.data && response.data.reply) {
      return response.data.reply;
    } else {
      throw new Error('Formato de resposta inválido');
    }
  } catch (error) {
    console.error('Erro ao enviar mensagem para o webhook:', error);
    throw error;
  }
};
```

## Formato das Requisições e Respostas

### Requisição enviada para o n8n

```json
{
  "message": "texto digitado pelo usuário",
  "sessionId": "id-único-da-sessão"
}
```

### Resposta esperada do n8n

```json
{
  "reply": "resposta gerada"
}
```

## Configuração do Webhook no n8n

No n8n, configure o webhook para:

1. Receber mensagens em formato JSON
2. Processar a mensagem usando o campo "message" da requisição
3. Retornar um objeto JSON com o campo "reply" contendo a resposta

### Exemplo de Fluxo no n8n

1. **Nó de Webhook**: Configura um endpoint HTTP para receber as mensagens
2. **Nó de Função**: Extrai a mensagem da requisição 
3. **Nó de Integração com IA/Banco de Dados**: Processa a mensagem e gera uma resposta
4. **Nó de Resposta**: Retorna a resposta formatada em JSON com o campo "reply"

## Testando a Integração

Para testar a integração sem o front-end, você pode usar ferramentas como:

1. **cURL**:
   ```bash
   curl -X POST https://n8n.afeera.com.br/webhook/expressao \
     -H "Content-Type: application/json" \
     -d '{"message":"Olá, como você está?", "sessionId":"12345-teste-id"}'
   ```

2. **Postman**: Configure uma requisição POST para a URL do webhook com o corpo em JSON contendo o campo "message"

## Personalizando a Integração

Para personalizar o formato das mensagens enviadas ao n8n:

1. Modifique o arquivo `src/services/chatService.ts` para alterar a estrutura da requisição
2. Ajuste o arquivo `src/components/ChatContainer.tsx` para processar diferentes formatos de resposta

Se o n8n retornar informações adicionais além da resposta de texto, você pode expandir o tipo `Message` em `src/types/chat.ts` para incluir esses campos adicionais. 

## Configuração CORS no n8n

Para permitir requisições cross-origin do frontend para o n8n, adicione os seguintes cabeçalhos de resposta no n8n:

```
Access-Control-Allow-Origin: *  (ou http://10.30.11.11:3000)
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept
Content-Type: application/json
```
