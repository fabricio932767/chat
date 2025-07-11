# Chat N8N - Guia de Inicialização

## 📋 Pré-requisitos

- **Node.js** 18.0.0+ (recomendado: 20.0.0+)
- **NPM** ou **Yarn**

```bash
# Verificar instalação
node --version && npm --version
```

## 🚀 Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Configurar webhook (opcional)
# Crie .env na raiz:
echo "NEXT_PUBLIC_WEBHOOK_URL=https://seu-webhook-n8n" > .env

# 3. Iniciar desenvolvimento
npm run dev
```

**Acesso**: http://localhost:3000

## 📝 Scripts Principais

| Comando | Função |
|---------|--------|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build produção |
| `npm run start` | Servidor produção |
| `npm run lint` | Verificação código |

## 🔧 Funcionalidades

### Chat
- Digite e pressione **Enter** para enviar
- Auto-focus após envio (sem necessidade de mouse)
- Temas claro/escuro (botão no cabeçalho)

### Upload de Arquivos
- **Formatos**: PDF, Word, Excel, TXT, CSV, RTF, PowerPoint, Imagens
- **Limite**: 50MB por arquivo
- **Métodos**: Arraste/solte ou clique no ícone 📎

### Armazenamento
- Histórico salvo automaticamente (localStorage)
- "Novo chat" limpa histórico

## 🛠️ Solução de Problemas

### Porta ocupada
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac  
lsof -ti:3000 | xargs kill -9
```

### Reset dependências
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📁 Estrutura Essencial

```
chat-n8n/
├── src/
│   ├── app/page.tsx              # Página principal
│   ├── components/               # Componentes React
│   │   ├── ChatContainer.tsx     # Container principal
│   │   ├── ChatHeader.tsx        # Cabeçalho
│   │   └── MessageItem.tsx       # Item de mensagem
│   └── services/chatService.ts   # Integração N8N
├── public/DudaPerfil.png         # Avatar da Duda
└── package.json                  # Configurações
```

---
**Sistema otimizado e funcional** ✅ 