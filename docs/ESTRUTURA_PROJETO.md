# Estrutura do Projeto Chat N8N

## Visão Geral

Este projeto é uma aplicação de chat em tempo real construída com Next.js 15, React 19 e TypeScript, que permite comunicação com um agente de IA através do N8N. A aplicação suporta upload e processamento de arquivos PDF, Excel e Word.

## Estrutura de Diretórios

```
chat-n8n/
├── docs/                           # Documentação do projeto
│   ├── ESTRUTURA_PROJETO.md        # Este arquivo - estrutura do projeto
│   ├── TECNOLOGIAS.md              # Tecnologias utilizadas
│   ├── COMO_INICIAR.md             # Guia de instalação e execução
│   ├── MODIFICACOES.md             # Histórico de modificações
│   └── RESPONSABILIDADES.md        # Responsabilidades de cada documento
├── public/                         # Arquivos estáticos públicos
│   ├── file.svg                    # Ícone de arquivo
│   ├── globe.svg                   # Ícone de globo
│   ├── next.svg                    # Logo do Next.js
│   ├── vercel.svg                  # Logo da Vercel
│   └── window.svg                  # Ícone de janela
├── src/                            # Código fonte da aplicação
│   ├── app/                        # App Router do Next.js 15
│   │   ├── api/                    # API Routes
│   │   │   └── upload/             # Endpoint para upload de arquivos
│   │   │       └── route.ts        # Processamento de uploads
│   │   ├── favicon.ico             # Ícone da aplicação
│   │   ├── globals.css             # Estilos globais
│   │   ├── layout.tsx              # Layout principal
│   │   └── page.tsx                # Página inicial
│   ├── components/                 # Componentes React reutilizáveis
│   │   ├── ChatContainer.tsx       # Container principal do chat
│   │   ├── FileUpload.tsx          # Componente de upload de arquivos
│   │   ├── MessageAttachments.tsx  # Exibição de anexos nas mensagens
│   │   ├── MessageForm.tsx         # Formulário de envio de mensagens
│   │   └── MessageItem.tsx         # Item de mensagem individual
│   ├── services/                   # Serviços e integrações externas
│   │   └── chatService.ts          # Comunicação com webhook do N8N
│   ├── types/                      # Definições de tipos TypeScript
│   │   ├── bootstrap.d.ts          # Tipos do Bootstrap
│   │   └── chat.ts                 # Tipos relacionados ao chat
│   └── utils/                      # Utilitários e helpers
│       └── localStorage.ts         # Gerenciamento do localStorage
├── .gitignore                      # Arquivos ignorados pelo Git
├── .next/                          # Build do Next.js (não versionado)
├── eslint.config.mjs               # Configuração do ESLint
├── next-env.d.ts                   # Definições de tipos do Next.js
├── next.config.ts                  # Configuração do Next.js
├── node_modules/                   # Dependências (não versionado)
├── package-lock.json               # Lockfile das dependências
├── package.json                    # Configuração do projeto e dependências
├── postcss.config.mjs              # Configuração do PostCSS
├── README.md                       # Documentação principal
└── tsconfig.json                   # Configuração do TypeScript
```

## Componentes Principais

### 1. ChatContainer (`src/components/ChatContainer.tsx`)
- **Responsabilidade**: Gerencia o estado principal do chat
- **Funcionalidades**:
  - Controle de mensagens e sessões
  - Integração com localStorage
  - Gerenciamento de tema (claro/escuro)
  - Processamento de arquivos anexados
  - Comunicação com o serviço N8N

### 2. FileUpload (`src/components/FileUpload.tsx`)
- **Responsabilidade**: Interface de upload de arquivos
- **Funcionalidades**:
  - Drag & drop de arquivos
  - Validação de tipos (PDF, Excel, Word)
  - Processamento assíncrono
  - Feedback visual de upload

### 3. MessageItem (`src/components/MessageItem.tsx`)
- **Responsabilidade**: Renderização de mensagens individuais
- **Funcionalidades**:
  - Exibição de mensagens do usuário e assistente
  - Suporte a anexos
  - Avatares dinâmicos

### 4. MessageAttachments (`src/components/MessageAttachments.tsx`)
- **Responsabilidade**: Exibição de anexos nas mensagens
- **Funcionalidades**:
  - Ícones específicos por tipo de arquivo
  - Informações de tamanho
  - Layout responsivo

## Serviços

### 1. Chat Service (`src/services/chatService.ts`)
- **Responsabilidade**: Comunicação com N8N
- **Funcionalidades**:
  - Envio de mensagens via webhook
  - Processamento de respostas
  - Tratamento de erros
  - Suporte a anexos

### 2. API Upload (`src/app/api/upload/route.ts`)
- **Responsabilidade**: Processamento de uploads
- **Funcionalidades**:
  - Validação de arquivos
  - Extração de conteúdo (PDF, Excel, Word)
  - Tratamento de erros
  - Retorno de dados estruturados

## Tipos TypeScript

### 1. Chat Types (`src/types/chat.ts`)
- `Message`: Estrutura de mensagens
- `ChatSession`: Sessões de conversa
- `FileAttachment`: Anexos de arquivo
- `FileUploadResponse`: Resposta de upload

## Utilitários

### 1. LocalStorage (`src/utils/localStorage.ts`)
- **Responsabilidade**: Persistência local
- **Funcionalidades**:
  - Salvamento de sessões
  - Recuperação de histórico
  - Limpeza de dados

## Fluxo de Dados

1. **Upload de Arquivo**:
   ```
   FileUpload → API Upload → Extração de Conteúdo → ChatContainer
   ```

2. **Envio de Mensagem**:
   ```
   ChatContainer → Chat Service → N8N Webhook → Resposta
   ```

3. **Persistência**:
   ```
   ChatContainer → LocalStorage → Recuperação na próxima sessão
   ```

## Padrões Arquiteturais

- **Component-Based Architecture**: Componentes React modulares e reutilizáveis
- **Service Layer**: Separação de lógica de negócio em serviços
- **Type Safety**: TypeScript para garantir tipagem segura
- **State Management**: React hooks para gerenciamento de estado local
- **File Processing**: Processamento server-side de arquivos
- **Responsive Design**: Interface adaptável a diferentes dispositivos

## Configurações

### Environment Variables
- `NEXT_PUBLIC_WEBHOOK_URL`: URL do webhook do N8N

### Next.js Configuration
- Turbopack para desenvolvimento
- Configurações de rede para acesso externo
- Otimizações de build

### Styling
- CSS Modules com variáveis CSS
- Suporte a tema claro/escuro
- Design system consistente 