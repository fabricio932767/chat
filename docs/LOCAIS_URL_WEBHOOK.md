# Locais das URLs do Webhook

Este documento lista todos os locais onde as URLs do webhook estão configuradas no projeto.

## URLs Disponíveis

- **Produção**: `https://n8n.afeera.com.br/webhook/expressao`
- **Teste**: `https://n8n.afeera.com.br/webhook-test/expressao`

## Locais de Configuração

1. **Variável de Ambiente Principal**
   - Arquivo: `.env`
   - Configuração: `NEXT_PUBLIC_WEBHOOK_URL`

2. **Serviço de Chat**
   - Arquivo: `src/services/chatService.ts`
   - Configuração: `const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || 'URL_PADRAO'`

3. **Documentação de Troubleshooting**
   - Arquivo: `docs/TROUBLESHOOTING.md`
   - Seção: Configuração do Webhook

4. **Documentação de Integração**
   - Arquivo: `docs/INTEGRATION.md`
   - Seção: Configuração do Webhook

5. **README Principal**
   - Arquivo: `README.md`
   - Seção: Configuração do Ambiente

## Como Alterar

Para alterar a URL do webhook:

1. Atualize a variável de ambiente `NEXT_PUBLIC_WEBHOOK_URL` no arquivo `.env`
2. Atualize a URL padrão no arquivo `src/services/chatService.ts`
3. Atualize a documentação nos arquivos mencionados acima

## Notas Importantes

- A URL de produção deve ser usada em ambiente de produção
- A URL de teste deve ser usada apenas em ambiente de desenvolvimento
- Sempre teste a conexão após alterar as URLs
- Mantenha a documentação atualizada quando fizer alterações 