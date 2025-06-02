# Referências Visuais do Chat N8N

Este documento complementa a documentação de layout fornecendo descrições detalhadas das telas e elementos visuais do chat.

## Tela Principal do Chat

A tela principal do chat segue o padrão de aplicativos de mensagem modernos, com elementos claramente definidos:

```
+----------------------------------------------+
|  [Cabeçalho] Virtual Assistant       [◯ ◯ ◯] |
|----------------------------------------------|
|                                              |
|                                              |
|                  [Vazio]                     |
|         Inicie uma nova conversa             |
|                                              |
|                                              |
|----------------------------------------------|
|  [😀]  Digite uma nova mensagem        [➤]   |
+----------------------------------------------+
```

### Quando há mensagens:

```
+----------------------------------------------+
|  [Cabeçalho] Virtual Assistant       [◯ ◯ ◯] |
|----------------------------------------------|
|                                              |
|  [👤] Olá, como posso ajudar?                |
|                                              |
|                             Preciso de ajuda |
|                            com meu projeto [👤] |
|                                              |
|  [👤] Claro, em que posso                    |
|      ajudar especificamente?                 |
|                                              |
|----------------------------------------------|
|  [😀]  Digite uma nova mensagem        [➤]   |
+----------------------------------------------+
```

## Elementos de Interface

### 1. Cabeçalho
O cabeçalho é uma barra horizontal no topo da aplicação com fundo azul (`--main-color`).

**Elementos:**
- **Botão de voltar**: Seta para esquerda (← ícone)
- **Avatar do assistente**: Círculo com ícone de usuário
- **Nome do assistente**: "Virtual Assistant"
- **Status online**: Texto pequeno "Online"
- **Botões de ação**: Ícones para telefone, vídeo e menu

### 2. Área de Mensagens

**Estado vazio:**
- Ícone central sugestivo (chat/mensagem)
- Texto "Inicie uma nova conversa"

**Mensagens ativas:**
- **Mensagem do assistente**: 
  - Alinhada à esquerda
  - Bolha cinza claro
  - Avatar à esquerda
  - Texto em cinza escuro

- **Mensagem do usuário**: 
  - Alinhada à direita
  - Bolha azul
  - Avatar à direita (opcional)
  - Texto em branco

- **Indicador de digitação**:
  - Três pontos animados
  - Dentro de uma bolha cinza
  - Alinhado à esquerda como mensagem do assistente

### 3. Campo de Entrada

Barra inferior com fundo branco e bordas sutis:

- **Botão de emoji**: Ícone de emoticon (😀)
- **Campo de texto**: Área para digitação com placeholder "Digite uma nova mensagem"
- **Botão de enviar**: Ícone de seta (➤) na cor azul (`--main-color`)

## Responsividade

### Tela Mobile
Em dispositivos móveis, a interface ocupa toda a largura da tela e quase toda a altura:

```
+-----------------------+
| [Cabeçalho]      [◯ ◯] |
|-----------------------|
|                       |
|  [👤] Mensagem        |
|                       |
|        Resposta [👤]  |
|                       |
|-----------------------|
| [😀] Digite...   [➤]  |
+-----------------------+
```

### Tela Desktop
Em telas maiores, o chat é centralizado com largura limitada e bordas arredondadas:

```
+---------------------------------------+
|                                       |
|  +-------------------------------+    |
|  | [Cabeçalho]             [◯ ◯] |    |
|  |-------------------------------|    |
|  |                               |    |
|  | [👤] Mensagem                 |    |
|  |                               |    |
|  |          Resposta [👤]        |    |
|  |                               |    |
|  |-------------------------------|    |
|  | [😀] Digite...          [➤]   |    |
|  +-------------------------------+    |
|                                       |
+---------------------------------------+
```

## Estados Visuais

### Estado de Carregamento
Durante o envio/recebimento de mensagens:
- Botão de envio desativado (opacidade reduzida)
- Animação de três pontos na área de mensagens

### Estado de Erro
Quando ocorre um erro na comunicação:
- Mensagem de erro em fundo vermelho suave
- Texto em vermelho

## Personalização de Cores

O tema padrão usa azul (`#1d9bf0`), mas pode ser facilmente personalizado:

- **Azul** (padrão): Aparência semelhante ao Twitter/Messenger
- **Verde**: Aparência semelhante ao WhatsApp
- **Roxo**: Aparência mais corporativa
- **Rosa**: Aparência mais descontraída

Para alterar, basta modificar a variável `--main-color` no arquivo de CSS. 