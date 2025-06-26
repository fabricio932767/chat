# Responsabilidades dos Documentos e Arquivos - Chat N8N

## 📁 Documentação (docs/)

### `ESTRUTURA_PROJETO.md`
**Responsabilidade**: Documentação completa da arquitetura do projeto
- **Conteúdo**: Estrutura de diretórios, componentes principais, fluxo de dados
- **Público-alvo**: Desenvolvedores novos no projeto, arquitetos de software
- **Manutenção**: Atualizar sempre que novos componentes forem adicionados
- **Importância**: 🔴 Crítica - Base para entendimento do projeto

### `TECNOLOGIAS.md`
**Responsabilidade**: Listagem e explicação de todas as tecnologias utilizadas
- **Conteúdo**: Frameworks, bibliotecas, ferramentas, versões
- **Público-alvo**: Desenvolvedores, gerentes técnicos, equipes de deploy
- **Manutenção**: Atualizar quando dependências forem modificadas
- **Importância**: 🟡 Alta - Essencial para configuração e troubleshooting

### `COMO_INICIAR.md`
**Responsabilidade**: Guia step-by-step para executar o projeto
- **Conteúdo**: Instalação, configuração, execução, troubleshooting
- **Público-alvo**: Novos desenvolvedores, equipes de QA, DevOps
- **Manutenção**: Testar e atualizar com cada release
- **Importância**: 🔴 Crítica - Primeiro contato com o projeto

### `MODIFICACOES.md`
**Responsabilidade**: Histórico detalhado de mudanças e melhorias
- **Conteúdo**: Changelog, breaking changes, novas funcionalidades
- **Público-alvo**: Equipe de desenvolvimento, stakeholders
- **Manutenção**: Atualizar a cada modificação significativa
- **Importância**: 🟡 Alta - Rastreabilidade e comunicação

### `RESPONSABILIDADES.md` (este arquivo)
**Responsabilidade**: Meta-documentação sobre o propósito de cada arquivo
- **Conteúdo**: Explicação de responsabilidades e importância
- **Público-alvo**: Novos desenvolvedores, mantenedores do projeto
- **Manutenção**: Atualizar quando novos arquivos forem criados
- **Importância**: 🟢 Média - Orientação para manutenção

---

## ⚛️ Componentes React (src/components/)

### `ChatContainer.tsx`
**Responsabilidade**: Gerenciamento central do estado do chat
- **Funcionalidades**:
  - Controle de mensagens e sessões
  - Integração com localStorage
  - Gerenciamento de tema
  - Coordenação de upload de arquivos
  - Comunicação com serviços externos
- **Dependências**: Todos os outros componentes de UI
- **Importância**: 🔴 Crítica - Coração da aplicação
- **Manutenção**: Cuidado especial com mudanças, pode afetar toda a aplicação

### `FileUpload.tsx`
**Responsabilidade**: Interface e lógica de upload de arquivos
- **Funcionalidades**:
  - Drag & drop de arquivos
  - Validação client-side
  - Feedback visual de upload
  - Integração com API de upload
- **Dependências**: react-dropzone, API /upload
- **Importância**: 🟡 Alta - Funcionalidade diferencial
- **Manutenção**: Testar com diferentes tipos de arquivo

### `MessageItem.tsx`
**Responsabilidade**: Renderização individual de mensagens
- **Funcionalidades**:
  - Exibição de conteúdo de mensagem
  - Renderização de anexos
  - Diferenciação visual usuário/assistente
- **Dependências**: MessageAttachments
- **Importância**: 🟡 Alta - Interface principal do usuário
- **Manutenção**: Cuidado com performance em listas grandes

### `MessageAttachments.tsx`
**Responsabilidade**: Exibição visual de anexos
- **Funcionalidades**:
  - Ícones por tipo de arquivo
  - Formatação de tamanho
  - Layout responsivo
- **Dependências**: Tipos FileAttachment
- **Importância**: 🟢 Média - Complementar ao upload
- **Manutenção**: Adicionar novos tipos de arquivo conforme necessário

### `MessageForm.tsx` (legado)
**Responsabilidade**: Formulário de envio de mensagens (atualmente não usado)
- **Status**: Mantido para compatibilidade
- **Funcionalidades**: Input de texto e envio
- **Importância**: 🟢 Baixa - Funcionalidade movida para ChatContainer
- **Manutenção**: Considerar remoção em futuras versões

---

## 🔧 Serviços (src/services/)

### `chatService.ts`
**Responsabilidade**: Comunicação com webhook do N8N
- **Funcionalidades**:
  - Envio de mensagens HTTP
  - Processamento de respostas
  - Tratamento de erros
  - Suporte a anexos
- **Dependências**: axios, tipos de chat
- **Importância**: 🔴 Crítica - Ponte com IA externa
- **Manutenção**: Monitorar mudanças na API do N8N

---

## 🌐 API Routes (src/app/api/)

### `upload/route.ts`
**Responsabilidade**: Processamento server-side de uploads
- **Funcionalidades**:
  - Validação de arquivos
  - Extração de conteúdo
  - Processamento por tipo (PDF, Excel, Word)
  - Retorno de dados estruturados
- **Dependências**: formidable, pdf-parse, xlsx, mammoth
- **Importância**: 🔴 Crítica - Core da funcionalidade de upload
- **Manutenção**: Testar com arquivos problemáticos, monitorar performance

---

## 📊 Tipos TypeScript (src/types/)

### `chat.ts`
**Responsabilidade**: Definições de tipos relacionados ao chat
- **Tipos Principais**:
  - `Message`: Estrutura de mensagens
  - `ChatSession`: Sessões de conversa
  - `FileAttachment`: Anexos de arquivo
  - `FileUploadResponse`: Resposta de upload
- **Dependências**: Nenhuma
- **Importância**: 🔴 Crítica - Base da type safety
- **Manutenção**: Manter sincronizado com mudanças de funcionalidade

### `bootstrap.d.ts`
**Responsabilidade**: Tipos para Bootstrap CSS
- **Funcionalidades**: Definições de tipos para componentes Bootstrap
- **Dependências**: @types/bootstrap
- **Importância**: 🟢 Baixa - Uso limitado de Bootstrap
- **Manutenção**: Manter se Bootstrap for usado mais extensivamente

---

## 🛠️ Utilitários (src/utils/)

### `localStorage.ts`
**Responsabilidade**: Gerenciamento de persistência local
- **Funcionalidades**:
  - Salvamento de sessões
  - Recuperação de histórico
  - Limpeza de dados
  - Serialização/deserialização
- **Dependências**: Tipos de chat
- **Importância**: 🟡 Alta - Persistência de dados
- **Manutenção**: Considerar migração para banco de dados

---

## 🎨 Interface (src/app/)

### `page.tsx`
**Responsabilidade**: Página principal da aplicação
- **Funcionalidades**: Renderização do ChatContainer principal
- **Dependências**: ChatContainer
- **Importância**: 🟡 Alta - Ponto de entrada da aplicação
- **Manutenção**: Manter simples, lógica deve ficar nos componentes

### `layout.tsx`
**Responsabilidade**: Layout global da aplicação
- **Funcionalidades**: HTML base, meta tags, providers
- **Dependências**: Nenhuma significativa
- **Importância**: 🟡 Alta - Configuração global
- **Manutenção**: Cuidado com mudanças que afetem SEO ou performance

### `globals.css`
**Responsabilidade**: Estilos globais e sistema de design
- **Funcionalidades**:
  - Variáveis CSS para temas
  - Estilos de componentes
  - Design responsivo
  - Animações e transições
- **Dependências**: Bootstrap (mínimo)
- **Importância**: 🔴 Crítica - Visual da aplicação
- **Manutenção**: Manter organizado, documentar variáveis CSS

---

## ⚙️ Configuração

### `package.json`
**Responsabilidade**: Configuração do projeto e dependências
- **Conteúdo**: Scripts, dependências, metadados
- **Importância**: 🔴 Crítica - Base do projeto
- **Manutenção**: Manter dependências atualizadas, documentar scripts

### `next.config.ts`
**Responsabilidade**: Configuração do Next.js
- **Conteúdo**: Environment vars, otimizações, configurações de rede
- **Importância**: 🟡 Alta - Comportamento da aplicação
- **Manutenção**: Testar mudanças em diferentes ambientes

### `tsconfig.json`
**Responsabilidade**: Configuração do TypeScript
- **Conteúdo**: Opções de compilação, paths, strict mode
- **Importância**: 🟡 Alta - Qualidade do código TypeScript
- **Manutenção**: Manter strict mode, atualizar com novas features

### `eslint.config.mjs`
**Responsabilidade**: Configuração de linting
- **Conteúdo**: Regras de código, plugins
- **Importância**: 🟢 Média - Qualidade de código
- **Manutenção**: Revisar regras periodicamente

### `postcss.config.mjs`
**Responsabilidade**: Configuração de processamento CSS
- **Conteúdo**: Plugins CSS, transformações
- **Importância**: 🟢 Baixa - Otimizações CSS
- **Manutenção**: Atualizar conforme necessário

---

## 📝 Arquivos de Meta-informação

### `README.md`
**Responsabilidade**: Documentação principal e overview do projeto
- **Conteúdo**: Introdução, instalação básica, links para docs
- **Público-alvo**: Primeiro contato, desenvolvedores externos
- **Importância**: 🔴 Crítica - Cartão de visitas do projeto
- **Manutenção**: Manter atualizado e conciso

### `.gitignore`
**Responsabilidade**: Arquivos excluídos do controle de versão
- **Conteúdo**: node_modules, .env, builds, logs
- **Importância**: 🟡 Alta - Segurança e limpeza do repo
- **Manutenção**: Adicionar novos padrões conforme necessário

---

## 🔄 Relacionamento entre Arquivos

### Fluxo Principal
```
page.tsx → ChatContainer.tsx → MessageItem.tsx → MessageAttachments.tsx
                ↓
            chatService.ts → N8N Webhook
                ↓
            localStorage.ts → Persistência
```

### Upload de Arquivos
```
FileUpload.tsx → api/upload/route.ts → Extração de Conteúdo
                      ↓
                ChatContainer.tsx → chatService.ts
```

### Tipagem
```
chat.ts → Todos os componentes (type safety)
```

---

## 🚨 Arquivos Críticos (Não Modificar sem Cuidado)

### Nível 1 - Crítico
- `src/components/ChatContainer.tsx`
- `src/services/chatService.ts`
- `src/types/chat.ts`
- `src/app/api/upload/route.ts`
- `package.json`

### Nível 2 - Importante
- `src/app/globals.css`
- `src/components/FileUpload.tsx`
- `src/utils/localStorage.ts`
- `next.config.ts`

### Nível 3 - Modificável
- `src/components/MessageAttachments.tsx`
- `docs/*` (toda documentação)
- Arquivos de configuração de desenvolvimento

---

## 📋 Checklist de Manutenção

### Ao Adicionar Nova Funcionalidade
- [ ] Atualizar tipos em `chat.ts`
- [ ] Documentar em `MODIFICACOES.md`
- [ ] Atualizar `ESTRUTURA_PROJETO.md` se necessário
- [ ] Testar e atualizar `COMO_INICIAR.md`
- [ ] Adicionar/atualizar estilos CSS
- [ ] Considerar impacto no `chatService.ts`

### Ao Modificar Dependências
- [ ] Atualizar `package.json`
- [ ] Documentar em `TECNOLOGIAS.md`
- [ ] Testar compatibilidade
- [ ] Atualizar documentação de instalação

### Ao Refatorar Componentes
- [ ] Manter interface pública
- [ ] Atualizar documentação de estrutura
- [ ] Testar integração com outros componentes
- [ ] Verificar imports/exports

---

## 🎯 Responsabilidades por Papel

### Desenvolvedor Frontend
- Componentes React (`src/components/`)
- Estilos CSS (`src/app/globals.css`)
- Tipos TypeScript (`src/types/`)

### Desenvolvedor Backend
- API Routes (`src/app/api/`)
- Serviços (`src/services/`)
- Configurações do Next.js

### DevOps/Infraestrutura
- Configurações de build
- Environment variables
- Deploy e monitoramento

### Product Owner/Stakeholder
- Documentação de funcionalidades (`docs/`)
- Requisitos e roadmap
- Testing e validação

### Mantenedor do Projeto
- Documentação geral
- Dependências e segurança
- Arquitetura e padrões de código 