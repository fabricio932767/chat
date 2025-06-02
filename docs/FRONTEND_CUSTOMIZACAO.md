# Guia de Customização do Frontend

Este documento explica como personalizar a aparência e comportamento do chat.

## Personalização de Cores

### Alterando a Cor Principal

O chat utiliza uma variável CSS `--main-color` para definir a cor principal do tema. Esta cor é aplicada em:
- Cabeçalho
- Mensagens do usuário
- Botão de enviar
- Elementos interativos

Para alterar a cor principal:

1. Abra o arquivo `src/app/globals.css`
2. Localize a seção de variáveis CSS:
   ```css
   :root {
     --main-color: #1d9bf0; /* Azul padrão */
     --main-bg: #fff;
   }
   ```
3. Substitua o valor `#1d9bf0` pela cor desejada:
   - Verde WhatsApp: `#25D366`
   - Roxo Corporativo: `#6E48AA`
   - Rosa: `#FF4081`
   - Laranja: `#F57C00`

### Alterando o Background

Para alterar a cor de fundo da aplicação, modifique a variável `--main-bg` no mesmo arquivo.

## Personalização de Textos

### Nome do Assistente Virtual

Para mudar o nome exibido no cabeçalho:

1. Abra o arquivo `src/components/ChatContainer.tsx`
2. Localize a linha com `<div className="font-semibold">Virtual Assistant</div>`
3. Substitua "Virtual Assistant" pelo nome desejado

### Mensagens e Placeholders

- **Placeholder do campo de texto**: Localize `placeholder="Digite uma nova mensagem"` e altere o texto
- **Mensagem de boas-vindas**: Altere o texto `<p>Inicie uma nova conversa</p>`

## Personalização de Avatares

### Avatar do Assistente

Para substituir o ícone padrão do avatar por uma imagem:

1. Adicione a imagem desejada em `public/images/`
2. Em `src/components/MessageItem.tsx`, localize o bloco do avatar do assistente
3. Substitua o SVG por uma tag `<img>`:
   ```tsx
   {!isUser && (
     <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2 overflow-hidden">
       <img src="/images/seu-avatar.png" alt="Assistant Avatar" className="w-full h-full object-cover" />
     </div>
   )}
   ```

### Avatar do Usuário

Siga o mesmo processo para o avatar do usuário, localizando o bloco correspondente no código.

## Personalização do Layout

### Tamanhos e Proporções

Para ajustar o tamanho do chat em diferentes dispositivos:

1. Em `src/components/ChatContainer.tsx`, localize as classes de tamanho:
   ```tsx
   <div className="w-full max-w-md md:max-w-lg h-[95vh] md:h-[90vh] flex flex-col ...">
   ```

2. Ajuste conforme necessário:
   - `max-w-md` (largura máxima em mobile): valores possíveis do Tailwind incluem `max-w-xs`, `max-w-sm`, `max-w-md`, `max-w-lg`, `max-w-xl`
   - `md:max-w-lg` (largura máxima em tablets/desktop)
   - `h-[95vh]` (altura em mobile): você pode usar valores como `h-[90vh]`, `h-[85vh]`, etc.
   - `md:h-[90vh]` (altura em tablets/desktop)

### Arredondamento das Bordas

Para ajustar o arredondamento das bordas:

1. Localize as classes de border-radius como `rounded-xl`, `rounded-2xl` ou `rounded-lg`
2. Substitua por outros valores do Tailwind: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-full`

## Adição de Funcionalidades

### Botões Adicionais

Para adicionar um botão (como anexar arquivos):

1. No arquivo `src/components/ChatContainer.tsx`, localize a área de entrada de mensagens
2. Adicione o novo botão seguindo o padrão dos existentes:
   ```tsx
   <button className="p-2 text-gray-500 hover:text-gray-700" type="button">
     oiooooooooo
   </button>
   ```

### Alterando os Ícones

Para substituir qualquer ícone:

1. Use ícones do Heroicons (já incluído) com novas paths
2. Ou use uma biblioteca como Font Awesome ou Material Icons adicionando-a ao projeto

## Modo Escuro (Dark Mode)

Para implementar um modo escuro:

1. Amplie as variáveis CSS em `globals.css`:
   ```css
   :root {
     --main-color: #1d9bf0;
     --main-bg: #fff;
     --text-color: #333;
     --message-bg: #f0f0f0;
   }
   
   .dark-mode {
     --main-bg: #121212;
     --text-color: #f0f0f0;
     --message-bg: #2a2a2a;
   }
   ```

2. Adicione um botão de alternância no cabeçalho para ativar a classe `dark-mode` no elemento raiz. 