const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');

/**
 * Classe SSLConfig simplificada para teste
 */
class SSLConfig {
  static loadCACertificate() {
    try {
      const certPath = path.join(process.cwd(), 'certs', 'rootCA.crt');
      
      if (fs.existsSync(certPath)) {
        const cert = fs.readFileSync(certPath, 'utf8');
        
        if (cert.includes('-----BEGIN CERTIFICATE-----') && 
            cert.includes('-----END CERTIFICATE-----')) {
          console.log('✅ Certificado da CA interna carregado com sucesso');
          console.log(`📁 Caminho: ${certPath}`);
          return cert;
        } else {
          console.error('❌ Arquivo rootCA.crt não contém um certificado válido');
          return null;
        }
      } else {
        console.warn('⚠️  Certificado da CA não encontrado em:', certPath);
        console.warn('   Arquivo esperado: rootCA.crt');
        console.warn('   Para configurar, veja: /certs/README.md');
        return null;
      }
    } catch (error) {
      console.error('❌ Erro ao carregar certificado da CA:', error);
      return null;
    }
  }
  
  static createHttpsAgent() {
    const caCert = this.loadCACertificate();
    
    if (caCert) {
      console.log('🔒 Criando agente HTTPS com certificado da CA interna');
      return new https.Agent({
        ca: caCert,
        rejectUnauthorized: true,
      });
    } else {
      // Fallback para desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.warn('🔓 Modo desenvolvimento: criando agente que ignora certificados SSL');
        console.warn('   ATENÇÃO: Isso não é seguro para produção!');
        return new https.Agent({
          rejectUnauthorized: false,
        });
      }
      
      throw new Error('Certificado da CA interna não configurado');
    }
  }
  
  static getStatus() {
    const cert = this.loadCACertificate();
    
    if (cert) {
      return {
        configured: true,
        message: 'Certificado da CA interna configurado corretamente'
      };
    } else {
      return {
        configured: false,
        message: 'Certificado da CA interna não configurado. Veja /certs/README.md'
      };
    }
  }
}

/**
 * Script para testar a conexão SSL com o webhook do N8N
 * Uso: node scripts/test-ssl.js
 */
async function testSSLConnection() {
  console.log('🧪 Testando conexão SSL com N8N...\n');
  
  try {
    // Verificar configuração SSL
    const status = SSLConfig.getStatus();
    console.log('📊 Status da configuração SSL:');
    console.log(`   Configurado: ${status.configured ? '✅' : '❌'}`);
    console.log(`   Mensagem: ${status.message}\n`);
    
    // URL do webhook
    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || 'https://n8ndev.intranet.wdcnet/webhook/chat-test';
    console.log(`🌐 URL de teste: ${webhookUrl}\n`);
    
    // Criar agente HTTPS
    const httpsAgent = SSLConfig.createHttpsAgent();
    console.log(`🔒 Agente HTTPS: ${httpsAgent ? 'Criado' : 'Não configurado'}\n`);
    
    // Fazer requisição de teste
    console.log('📤 Enviando requisição de teste...');
    const testPayload = {
      message: 'Teste de conexão SSL',
      sessionId: 'test-ssl-' + Date.now()
    };
    
    const response = await axios.post(webhookUrl, testPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000,
      ...(httpsAgent && { httpsAgent })
    });
    
    console.log('✅ Conexão SSL bem-sucedida!');
    console.log(`   Status: ${response.status}`);
    console.log(`   Resposta: ${JSON.stringify(response.data, null, 2)}`);
    
  } catch (error) {
    console.error('❌ Erro na conexão SSL:');
    
    if (error.code === 'SELF_SIGNED_CERT_IN_CHAIN') {
      console.error('   Causa: Certificado auto-assinado na cadeia');
      console.error('   Solução: Configure o certificado rootCA.crt em /certs/');
    } else if (error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
      console.error('   Causa: Não foi possível verificar a assinatura do certificado');
      console.error('   Solução: Verifique se o certificado rootCA.crt está correto');
    } else if (error.code === 'ENOTFOUND') {
      console.error('   Causa: Domínio não encontrado');
      console.error('   Solução: Verifique se você está na rede interna');
    } else if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error('   Erro:', error.message);
      console.error('   Código:', error.code);
    }
    
    console.error('\n💡 Dicas para resolver:');
    console.error('   1. Obtenha o certificado rootCA.crt do administrador');
    console.error('   2. Coloque-o em /certs/rootCA.crt');
    console.error('   3. Verifique se está na rede interna da empresa');
    console.error('   4. Execute: npm run test:ssl');
  }
}

// Executar teste se for chamado diretamente
if (require.main === module) {
  testSSLConnection();
}

module.exports = { testSSLConnection }; 