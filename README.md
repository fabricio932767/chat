# Chat N8N

Interface de chat em tempo real para comunicação com um servidor n8n através de webhook HTTP.

## Funcionalidades

- Interface de chat moderna similar ao ChatGPT
- Envio de mensagens em tempo real para um webhook do n8n
- Suporte a múltiplas sessões de chat
- Armazenamento local do histórico de conversas
- Feedback visual de carregamento durante a comunicação
- Design responsivo com suporte a tema claro/escuro

## Tecnologias

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```
3. A URL do webhook já está configurada por padrão, mas você pode alterá-la criando um arquivo `.env.local` na raiz do projeto:
   ```
   NEXT_PUBLIC_WEBHOOK_URL=https://n8ndev.intranet.wdcnet/webhook/chat-test
   ```

### Configuração SSL para Certificados Internos

Para conexões com endpoints HTTPS que usam certificados internos/auto-assinados:

1. **Obtenha o certificado da CA interna:**
   - Contate o administrador de rede para obter o arquivo `rootCA.crt`
   - Ou exporte do navegador: acesse a URL → Ver certificado → Exportar CA raiz

2. **Configure o certificado:**
   ```bash
   # Coloque o certificado no diretório correto
   cp rootCA.crt ./certs/rootCA.crt
   ```

3. **Teste a configuração:**
   ```bash
   npm run test:ssl
   ```

4. **Execute com SSL configurado:**
   ```bash
   # Desenvolvimento com SSL
   npm run dev:ssl
   
   # Build com SSL
   npm run build:ssl
   
   # Produção com SSL
   npm run start:ssl
   ```

**Estrutura de certificados esperada:**
```
/certs/
  ├── rootCA.crt        # Certificado da CA interna
  ├── rootCA.crt.example # Arquivo de exemplo
  └── README.md         # Instruções detalhadas
```

## Executando o projeto

```bash
npm run dev
# ou
yarn dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000).

## Documentação

Para mais informações sobre o projeto, consulte a documentação na pasta `docs/`:

- [Solução de Problemas](docs/TROUBLESHOOTING.md) - Guia de solução de problemas comuns
- [Integração com N8N](docs/INTEGRATION.md) - Detalhes sobre a integração com o webhook do n8n

## Estrutura do projeto

- `src/components/` - Componentes React para a interface do chat
- `src/services/` - Serviços para comunicação com o webhook do n8n
- `src/types/` - Tipos TypeScript para o projeto
- `src/utils/` - Funções utilitárias (armazenamento local, etc.)

## Formato da comunicação com o webhook

### Enviando mensagens para o n8n:

```json
{
  "message": "texto digitado pelo usuário",
  "sessionId": "id-único-da-sessão"
}
```

### Formato de resposta esperado do n8n:

```json
{
  "reply": "resposta gerada"
}
```

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Documentação do Projeto

### Sobre o Projeto

Esta aplicação é um chat interativo construído com Next.js, permitindo comunicação em tempo real e funcionalidades X, Y, Z (substitua X, Y, Z com as funcionalidades principais).

### Estrutura do Projeto

O projeto segue uma estrutura modular para facilitar a manutenção e escalabilidade:

-   **`chat-n8n/`**: Raiz do projeto.
    -   **`.next/`**: Diretório de build do Next.js. (Não versionado)
    -   **`docs/`**: Documentação adicional do projeto.
    -   **`node_modules/`**: Dependências do projeto. (Não versionado)
    -   **`public/`**: Arquivos estáticos servidos publicamente (imagens, fontes, etc.).
    -   **`src/`**: Código fonte da aplicação.
        -   **`app/`**: Contém as rotas, páginas e layouts da aplicação, seguindo o App Router do Next.js.
        -   **`components/`**: Componentes React reutilizáveis.
        -   **`services/`**: Módulos para interagir com APIs externas ou serviços de backend.
        -   **`types/`**: Definições de tipos TypeScript.
        -   **`utils/`**: Funções utilitárias e helpers.
    -   **`.env.example`**: Arquivo de exemplo para variáveis de ambiente (se aplicável).
    -   **`.eslint.config.mjs`**: Configurações do ESLint para linting do código.
    -   **`.gitignore`**: Especifica arquivos e pastas ignorados pelo Git.
    -   **`next-env.d.ts`**: Definições de tipos para o ambiente Next.js.
    -   **`next.config.ts`**: Configurações do Next.js.
    -   **`package-lock.json`**: Lockfile das dependências (gerado pelo npm).
    -   **`package.json`**: Define metadados do projeto, dependências e scripts.
    -   **`postcss.config.mjs`**: Configurações do PostCSS.
    -   **`README.md`**: Este arquivo, com informações sobre o projeto.
    -   **`tsconfig.json`**: Configurações do compilador TypeScript.

### Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados:

-   [Node.js](https://nodejs.org/) (versão 20 ou superior recomendada)
-   [npm](https://www.npmjs.com/) (geralmente vem com o Node.js) ou [Yarn](https://yarnpkg.com/)

### Instalação

1.  Clone o repositório:
    ```bash
    git clone <URL_DO_REPOSITORIO_NO_GITHUB>
    cd chat-n8n
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```
    ou, se você utilizar Yarn:
    ```bash
    yarn install
    ```

### Executando a Aplicação

**Modo de Desenvolvimento:**

Para iniciar o servidor de desenvolvimento com Turbopack (recarga rápida e outras otimizações):

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

**Build de Produção:**

Para criar uma build otimizada para produção:

```bash
npm run build
```

**Iniciando em Modo de Produção:**

Após o build, para iniciar o servidor em modo de produção:

```bash
npm run start
```

### Scripts Disponíveis

No arquivo `package.json`, você encontrará os seguintes scripts:

-   `dev`: Inicia a aplicação em modo de desenvolvimento com Turbopack.
-   `build`: Compila a aplicação para produção.
-   `start`: Inicia um servidor de produção (requer `npm run build` antes).
-   `lint`: Executa o linter (ESLint) para verificar a qualidade do código.

Lembre-se de substituir `<URL_DO_REPOSITORIO_NO_GITHUB>` pela URL correta quando o repositório for criado.
