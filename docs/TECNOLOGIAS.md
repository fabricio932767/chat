# Tecnologias Utilizadas - Chat N8N

## Frontend Framework

### Next.js 15.3.2
- **Descrição**: Framework React para desenvolvimento web moderno
- **Funcionalidades utilizadas**:
  - App Router (nova arquitetura de roteamento)
  - API Routes para backend
  - Server-Side Rendering (SSR)
  - Turbopack para desenvolvimento rápido
  - Build otimizado para produção
- **Por que foi escolhido**: 
  - Performance superior
  - Desenvolvimento full-stack integrado
  - Ecossistema maduro e bem documentado

### React 19.0.0
- **Descrição**: Biblioteca JavaScript para construção de interfaces de usuário
- **Funcionalidades utilizadas**:
  - Hooks (useState, useEffect, useRef)
  - Componentes funcionais
  - Event handling
  - State management local
- **Por que foi escolhido**:
  - Padrão da indústria para UIs reativas
  - Componentes reutilizáveis
  - Ecossistema rico de bibliotecas

## Linguagem de Programação

### TypeScript 5.x
- **Descrição**: Superset tipado do JavaScript
- **Benefícios**:
  - Type safety em tempo de desenvolvimento
  - IntelliSense aprimorado
  - Refatoração segura
  - Detecção precoce de erros
- **Uso no projeto**:
  - Tipagem de props de componentes
  - Interfaces para dados de chat
  - Tipos para anexos de arquivo
  - APIs type-safe

## Styling e UI

### CSS3 com CSS Variables
- **Descrição**: Estilização customizada com variáveis CSS
- **Funcionalidades**:
  - Tema claro/escuro dinâmico
  - Design responsivo
  - Animações CSS
  - Grid e Flexbox layouts

### Bootstrap 5.3.6
- **Descrição**: Framework CSS para desenvolvimento responsivo
- **Uso limitado**:
  - Sistema de grid ocasional
  - Classes utilitárias específicas
- **Observação**: Usado minimamente para não conflitar com CSS customizado

## Comunicação HTTP

### Axios 1.9.0
- **Descrição**: Cliente HTTP baseado em Promise
- **Uso no projeto**:
  - Comunicação com webhook do N8N
  - Tratamento de respostas e erros
  - Interceptação de requests
  - Headers customizados

## Processamento de Arquivos

### PDF-Parse 1.1.1
- **Descrição**: Biblioteca para extração de texto de PDFs
- **Funcionalidades**:
  - Extração de texto completo
  - Suporte a PDFs complexos
  - Processing assíncrono

### XLSX 0.18.5
- **Descrição**: Parser e writer para arquivos Excel
- **Funcionalidades**:
  - Leitura de múltiplas planilhas
  - Conversão para JSON
  - Suporte a .xlsx e .xls

### Mammoth 1.6.0
- **Descrição**: Conversor de documentos Word (.docx) para texto
- **Funcionalidades**:
  - Extração de texto puro
  - Preservação de estrutura básica
  - Processamento de imagens (opcional)

## Upload de Arquivos

### React Dropzone 14.2.3
- **Descrição**: Componente React para drag & drop de arquivos
- **Funcionalidades**:
  - Interface drag & drop intuitiva
  - Validação de tipos de arquivo
  - Prevenção de múltiplos uploads
  - Feedback visual para usuário

### Formidable 3.5.1
- **Descrição**: Parser de formulários multipart para Node.js
- **Uso**:
  - Processamento de uploads no backend
  - Validação de tamanho de arquivo
  - Manipulação segura de arquivos

## Utilitários

### UUID 11.1.0
- **Descrição**: Gerador de identificadores únicos universais
- **Uso no projeto**:
  - IDs únicos para mensagens
  - IDs para sessões de chat
  - IDs para anexos de arquivo

## Desenvolvimento e Build

### ESLint 9.x
- **Descrição**: Linter para JavaScript/TypeScript
- **Configuração**:
  - Regras do Next.js
  - Padrões de código TypeScript
  - Detecção de problemas em tempo real

### PostCSS 8.x
- **Descrição**: Processador de CSS
- **Plugins utilizados**:
  - Autoprefixer para compatibilidade
  - CSS nesting
  - Otimizações de build

## Integração Externa

### N8N Webhook
- **Descrição**: Plataforma de automação de workflows
- **Integração**:
  - Webhook HTTP para receber mensagens
  - Resposta em formato JSON
  - Suporte a anexos de arquivo

## Ambiente de Desenvolvimento

### Node.js 20+
- **Descrição**: Runtime JavaScript
- **Funcionalidades utilizadas**:
  - APIs nativas para manipulação de arquivos
  - Processamento assíncrono
  - Module system moderno

### NPM
- **Descrição**: Gerenciador de pacotes
- **Scripts disponíveis**:
  - `npm run dev`: Desenvolvimento com Turbopack
  - `npm run build`: Build de produção
  - `npm run start`: Servidor de produção
  - `npm run lint`: Verificação de código

## Arquivos de Configuração

### next.config.ts
- Configurações do Next.js
- Environment variables
- Otimizações de build
- Configurações de rede

### tsconfig.json
- Configurações do TypeScript
- Paths de módulos
- Targets de compilação
- Strict mode ativado

### eslint.config.mjs
- Regras de linting
- Plugins do Next.js
- Configurações personalizadas

### postcss.config.mjs
- Plugins do PostCSS
- Transformações CSS
- Otimizações

## Padrões de Desenvolvimento

### Clean Architecture
- Separação de responsabilidades
- Camadas bem definidas (UI, Service, Utils)
- Dependency injection manual

### Component-Driven Development
- Componentes reutilizáveis
- Props tipadas
- Single Responsibility Principle

### Error Handling
- Try-catch blocks
- Error boundaries implícitos
- Feedback ao usuário

### Performance
- Lazy loading de componentes
- Otimização de re-renders
- Bundle splitting automático

## Versionamento e Compatibilidade

### Compatibilidade de Navegadores
- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

### Node.js
- Versão mínima: 18.0.0
- Recomendada: 20.0.0+

### Sistema Operacional
- Windows 10+
- macOS 10.15+
- Linux (Ubuntu 20.04+)

## Bibliotecas de Tipos

### @types/node
- Tipos para APIs do Node.js
- Compatibilidade com TypeScript

### @types/react
- Tipos para React
- Props, hooks e eventos

### @types/uuid
- Tipos para biblioteca UUID
- Interfaces de função

### @types/bootstrap
- Tipos para Bootstrap CSS
- Classes e componentes

### @types/formidable
- Tipos para parsing de formulários
- Upload de arquivos

### @types/multer
- Tipos para middleware de upload
- Configurações de armazenamento 