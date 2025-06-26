# Certificados SSL

## Configuração para Certificado da CA Interna

Para que o frontend confie no certificado interno do N8N, você deve:

### 1. Obter o certificado da CA interna
- Copie o arquivo `rootCA.crt` (certificado da autoridade certificadora interna) para este diretório
- O arquivo deve se chamar exatamente `rootCA.crt`

### 2. Estrutura esperada:
```
/certs/
  ├── rootCA.crt    # Certificado da CA interna
  └── README.md     # Este arquivo
```

### 3. Como obter o certificado:
- Contate o administrador de rede/infraestrutura
- Ou exporte do navegador: vá até https://n8ndev.intranet.wdcnet → Ver certificado → Exportar CA raiz

### 4. Verificação:
Após colocar o certificado, reinicie a aplicação (`npm run dev`). 
Os logs no console devem mostrar conexão SSL bem-sucedida.

## Nota de Segurança
- Este diretório está no .gitignore para não vazar certificados internos
- Cada desenvolvedor deve configurar seu próprio certificado
- Para produção, use variável de ambiente `NODE_EXTRA_CA_CERTS` 