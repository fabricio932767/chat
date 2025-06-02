# Documentação do Frontend - Chat N8N

Este documento detalha a estrutura, layout e funcionalidades visuais da interface do chat.

## Estrutura Geral

A interface segue um modelo de mensageria moderna com os seguintes elementos principais:

- **Cabeçalho**: Barra superior azul com informações do assistente virtual
- **Área de Mensagens**: Corpo central com a troca de mensagens
- **Campo de Entrada**: Área inferior para digitação e envio de mensagens

## Componentes Principais

### 1. ChatContainer (src/components/ChatContainer.tsx)

Componente principal que gerencia o estado e orquestra os demais componentes.

**Funcionalidades:**
- Gerencia o estado das mensagens (`messages`)
- Controla o indicador de carregamento (`isLoading`)
- Armazena o histórico de conversas no localStorage
- Envia e recebe mensagens através do webhook do n8n
- Controla o estado de digitação (`inputMessage`)

**Layout:**
- Container flexível que ocupa a tela inteira em dispositivos móveis
- Em dispositivos maiores, apresenta uma largura máxima e bordas arredondadas
- Divisão em cabeçalho, área de mensagens e campo de entrada

### 2. MessageItem (src/components/MessageItem.tsx)

Componente responsável por renderizar cada mensagem individual.

**Visual:**
- Mensagens do usuário: azuis, alinhadas à direita, com avatar à direita
- Mensagens do assistente: cinzas, alinhadas à esquerda, com avatar à esquerda
- Bolhas de mensagem com cantos arredondados
- Avatares circulares para ambos os participantes

### 3. MessageForm

Componente de entrada de texto para envio de novas mensagens.

**Elementos:**
- Campo de texto com placeholder "Digite uma nova mensagem"
- Botão de emoji (emoticon)
- Botão de enviar em azul

## Cores e Estilos

O design utiliza variáveis CSS para facilitar a personalização:

```css
:root {
  --main-color: #1d9bf0; /* Azul principal */
  --main-bg: #fff;       /* Fundo branco */
}
```

**Paleta de cores:**
- **Azul** (`#1d9bf0`): Elementos principais, barra de cabeçalho, mensagens do usuário
- **Cinza claro** (`#f0f0f0`): Mensagens do assistente, elementos secundários
- **Branco**: Fundo principal
- **Cinza escuro**: Textos e ícones

## Responsividade

A interface se adapta aos diversos tamanhos de tela:

- **Mobile**: 
  - Ocupa toda a largura da tela
  - Altura ajustada para 95% da viewport
  - Sem bordas arredondadas nas extremidades

- **Tablet/Desktop**: 
  - Largura máxima controlada (`max-w-md md:max-w-lg`)
  - Altura menor (90% da viewport)
  - Bordas arredondadas e sombra
  - Mais espaçamento nos elementos

## Elementos Visuais

### Avatares
- Círculos com fundo cinza claro e ícone de usuário
- Tamanho fixo de 32x32px (w-8 h-8)

### Bolhas de Mensagens
- Bordas arredondadas (rounded-2xl)
- Padding interno consistente (px-3 py-2)
- Largura máxima de 75% do espaço disponível

### Indicadores
- Animação de digitação: três pontos com animação pulse
- Mensagens de erro em vermelho suave

## Personalização

Para personalizar a aparência visual:

1. **Cor Principal**: Altere a variável `--main-color` no arquivo `src/app/globals.css`
2. **Background**: Altere a variável `--main-bg` para mudar o fundo da aplicação
3. **Textos**: Os estilos de texto seguem as classes do Tailwind (`text-sm`, `text-base`, etc.)

## Interação

### Envio de Mensagens
- Teclado: Pressione Enter para enviar (Shift+Enter para nova linha)
- Mouse: Clique no botão de envio

### Estados Visuais
- **Carregando**: Exibe animação de três pontos
- **Erro**: Mostra mensagem em container vermelho
- **Vazio**: Exibe mensagem incentivando início de conversa

## Arquivos Principais

- `src/components/ChatContainer.tsx`: Componente principal e orquestração
- `src/components/MessageItem.tsx`: Renderização das mensagens
- `src/components/MessageForm.tsx`: Formulário de entrada
- `src/app/globals.css`: Estilos globais e variáveis CSS
- `src/services/chatService.ts`: Comunicação com o webhook 