# Como Iniciar o Projeto - Chat N8N

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em seu sistema:

### Software Obrigatório
- **Node.js** versão 18.0.0 ou superior (recomendado: 20.0.0+)
- **NPM** (geralmente vem com Node.js) ou **Yarn**
- **Git** para clonar o repositório

### Verificação dos Pré-requisitos
```bash
# Verificar versão do Node.js
node --version

# Verificar versão do NPM
npm --version

# Verificar Git
git --version
```

## Instalação

### 1. Clonar o Repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd chat-n8n
```

### 2. Instalar Dependências
```bash
# Usando NPM
npm install

# OU usando Yarn
yarn install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```bash
# .env
NEXT_PUBLIC_WEBHOOK_URL=https://n8ndev.intranet.wdcnet/webhook/chat-test
```

### 3.1 Configuração SSL para Certificados Internos

Se você está usando um certificado interno/autofirmado (como no exemplo acima), siga estes passos:

1. **Obtenha o certificado da CA interna:**
   - Contate o administrador de rede/infraestrutura
   - Ou exporte do navegador: vá até a URL do N8N → Clique no cadeado → Ver certificado → Exportar CA raiz

2. **Configure o certificado:**
   ```bash
   # Coloque o certificado da CA em:
   /certs/rootCA.crt
   ```

3. **Verifique a configuração:**
   ```bash
   npm run check-ssl
   ```

### 3.2 Alternativas de Configuração SSL

**Opção 1 (Recomendada):** Certificado em `/certs/rootCA.crt`
- A aplicação detecta automaticamente
- Use os comandos normais: `npm run dev`

**Opção 2:** Variável de ambiente
```bash
# Use os comandos específicos:
npm run dev:ssl
npm run build:ssl  
npm run start:ssl
```

**Opção 3:** Apenas para desenvolvimento (não recomendado)
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm run dev
```

**Observação**: Para URLs HTTP comuns, não é necessária configuração SSL.

## Executando o Projeto

### Modo Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# OU
yarn dev
```

A aplicação estará disponível em:
- **URL Local**: http://localhost:3000
- **URL de Rede**: http://172.19.1.56:3000 (ou seu IP local)

### Modo Produção
```bash
# Criar build de produção
npm run build

# Iniciar servidor de produção
npm run start
```

### Verificação de Código
```bash
# Executar linting
npm run lint
```

## Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| `dev` | `npm run dev` | Inicia desenvolvimento com Turbopack |
| `build` | `npm run build` | Cria build otimizado para produção |
| `start` | `npm run start` | Inicia servidor de produção |
| `lint` | `npm run lint` | Executa ESLint para verificar código |

## Configurações de Rede

### Acesso Local
- A aplicação está configurada para aceitar conexões de qualquer IP (`0.0.0.0`)
- Porta padrão: `3000`

### Acesso Externo
O projeto já está configurado para aceitar conexões de:
- `http://localhost:3000`
- `http://172.19.1.56` (exemplo de IP local)

## Funcionalidades Principais

### 1. Chat Básico
- Digite mensagens no campo de entrada
- Pressione Enter ou clique no botão enviar
- As mensagens são enviadas para o webhook do N8N

### 2. Upload de Arquivos
- **Formatos suportados**: PDF, Excel (.xlsx, .xls), Word (.docx, .doc)
- **Tamanho máximo**: 10MB por arquivo
- **Como usar**:
  1. Arraste e solte arquivos na área de upload
  2. OU clique para selecionar arquivos
  3. Aguarde o processamento
  4. Digite uma mensagem (opcional) e envie

### 3. Histórico de Conversas
- As conversas são salvas automaticamente no localStorage
- O histórico persiste entre sessões
- Use o botão "Novo chat" para limpar o histórico

### 4. Tema Claro/Escuro
- Clique no ícone de sol/lua no cabeçalho
- A preferência é salva automaticamente

## Estrutura de Arquivos Importantes

```
chat-n8n/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Página principal
│   │   ├── layout.tsx        # Layout da aplicação
│   │   └── api/upload/       # API de upload
│   ├── components/           # Componentes React
│   ├── services/            # Integração com N8N
│   └── types/               # Tipos TypeScript
├── public/                  # Arquivos estáticos
├── docs/                    # Documentação
└── package.json            # Configuração do projeto
```

## Solução de Problemas

### Erro de Dependências
```bash
# Limpar cache do NPM
npm cache clean --force

# Deletar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro de Porta Ocupada
```bash
# Para liberar a porta 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Para liberar a porta 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill -9
```

### Problemas de Permissão (Linux/Mac)
```bash
# Dar permissões de execução
chmod +x node_modules/.bin/*
```

### Erro de Memória
```bash
# Aumentar limite de memória do Node.js
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## Desenvolvimento

### Estrutura de Desenvolvimento
```bash
chat-n8n/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ChatContainer.tsx    # Container principal
│   │   ├── FileUpload.tsx       # Upload de arquivos
│   │   ├── MessageItem.tsx      # Item de mensagem
│   │   └── ...
│   ├── services/            # Lógica de negócio
│   └── types/               # Definições TypeScript
```

### Adicionando Novos Componentes
1. Crie o arquivo em `src/components/`
2. Use TypeScript e exporte como default
3. Importe no componente pai
4. Adicione tipos se necessário

### Modificando Estilos
- Estilos globais: `src/app/globals.css`
- Use variáveis CSS para tema claro/escuro
- Mantenha design responsivo

## Integração com N8N

### Configuração do Webhook
O projeto envia dados para o webhook no formato:
```json
{
  "message": "texto da mensagem",
  "sessionId": "id-unico-da-sessao",
  "attachments": [
    {
      "id": "file-id",
      "name": "arquivo.pdf",
      "type": "application/pdf",
      "size": 1024,
      "content": "conteudo extraido"
    }
  ],
  "fullMessage": "mensagem combinada com conteudo dos arquivos"
}
```

### Formato de Resposta Esperado
```json
{
  "reply": "resposta do assistente"
}
```

Ou alternativamente:
```json
{
  "output": "resposta do assistente"
}
```

## Deploy

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```dockerfile
# Exemplo de Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Variáveis de Ambiente para Produção
```bash
NEXT_PUBLIC_WEBHOOK_URL=https://seu-n8n.com/webhook/endpoint
```

## Monitoramento

### Logs de Desenvolvimento
- Os logs aparecem no terminal durante `npm run dev`
- Erros são exibidos no console do navegador

### Logs de Produção
- Use `console.log()` para debug
- Implemente logging mais robusto se necessário

## Backup e Versionamento

### Git
```bash
# Adicionar mudanças
git add .

# Commit
git commit -m "Descrição das mudanças"

# Push
git push origin main
```

### Backup de Dados
- As conversas ficam no localStorage do navegador
- Para backup permanente, implemente sincronização com banco de dados

## Suporte e Contato

Para dúvidas ou problemas:
1. Verifique a documentação em `docs/`
2. Consulte o arquivo `TROUBLESHOOTING.md`
3. Crie uma issue no repositório
4. Entre em contato com a equipe de desenvolvimento 