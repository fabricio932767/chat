# Solução de Problemas - Chat N8N

Este documento contém soluções para problemas comuns que podem ocorrer durante a configuração e execução do projeto Chat N8N.

## Problema: Módulo 'uuid' não encontrado

Se você encontrar o erro "Module not found: Can't resolve 'uuid'", siga estas etapas:

1. Limpe o cache do npm e reinstale as dependências:
   ```bash
   npm cache clean --force
   npm install --save uuid axios
   npm install --save-dev @types/uuid
   ```

2. Verifique se as dependências foram adicionadas ao package.json:
   ```json
   "dependencies": {
     "react": "^19.0.0",
     "react-dom": "^19.0.0",
     "next": "15.3.2",
     "uuid": "^x.x.x",
     "axios": "^x.x.x"
   },
   "devDependencies": {
     "@types/uuid": "^x.x.x",
     // outras dependências...
   }
   ```

3. Use o padrão de importação com alias (@/) em vez de caminhos relativos:
   ```typescript
   // Incorreto:
   import { sendMessage } from '../services/chatService';
   
   // Correto:
   import { sendMessage } from '@/services/chatService';
   ```

4. Reinicie completamente o servidor de desenvolvimento:
   ```bash
   npm run build
   npm start
   ```

## Problema: URL do webhook não configurada

Se você tiver problemas para se conectar ao webhook, verifique se a URL está configurada corretamente:

1. A URL padrão está configurada no arquivo `src/services/chatService.ts` e `next.config.ts`:
   ```javascript
   const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || 'https://n8n.afeera.com.br/webhook/expressao';
   ```

2. Para usar uma URL diferente, crie um arquivo `.env.local` na raiz do projeto:
   ```
   NEXT_PUBLIC_WEBHOOK_URL=sua-url-do-webhook
   ```

## Problema: CORS (Cross-Origin Resource Sharing)

Se você encontrar erros de CORS ao tentar se comunicar com o webhook:

1. Verifique se o servidor n8n está configurado para aceitar requisições do domínio do seu front-end
2. Como solução temporária para desenvolvimento, você pode usar uma extensão de navegador para desativar o CORS
3. Para uma solução permanente, configure corretamente os cabeçalhos CORS no servidor n8n

## Outros problemas comuns

### Erro de compilação TypeScript

Se encontrar erros de compilação TypeScript:

1. Verifique se todas as tipagens estão instaladas:
   ```bash
   npm install --save-dev @types/react @types/react-dom @types/node
   ```

2. Verifique se o arquivo tsconfig.json está configurado corretamente com os aliases:
   ```json
   "paths": {
     "@/*": ["./src/*"]
   }
   ```

### Problemas de estilo com Tailwind CSS

Se os estilos não estiverem sendo aplicados corretamente:

1. Verifique se o Tailwind CSS está configurado corretamente:
   ```bash
   npx tailwindcss init -p
   ```

2. Garanta que os arquivos de configuração do Tailwind estão apontando para os caminhos corretos dos arquivos

## Contato e suporte

Se você continuar enfrentando problemas após tentar estas soluções, abra uma issue no repositório do projeto ou entre em contato com a equipe de suporte. 