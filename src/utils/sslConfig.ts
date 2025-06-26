import fs from 'fs';
import https from 'https';
import path from 'path';

/**
 * Configuração SSL para certificados internos
 */
export class SSLConfig {
  private static caCert: string | null = null;
  private static initialized = false;
  
  /**
   * Carrega o certificado da CA interna
   */
  static loadCACertificate(): string | null {
    if (this.caCert) return this.caCert;
    
    try {
      const certPath = path.join(process.cwd(), 'certs', 'rootCA.crt');
      
      if (fs.existsSync(certPath)) {
        this.caCert = fs.readFileSync(certPath, 'utf8');
        
        // Validar se o arquivo contém um certificado válido
        if (this.caCert.includes('-----BEGIN CERTIFICATE-----') && 
            this.caCert.includes('-----END CERTIFICATE-----')) {
          console.log('✅ Certificado da CA interna carregado com sucesso');
          console.log(`📁 Caminho: ${certPath}`);
          this.initialized = true;
          return this.caCert;
        } else {
          console.error('❌ Arquivo rootCA.crt não contém um certificado válido');
          console.error('   Verifique se o conteúdo está correto');
          return null;
        }
      } else {
        console.warn('⚠️  Certificado da CA não encontrado em:', certPath);
        console.warn('   Arquivo esperado: rootCA.crt');
        console.warn('   Para configurar, veja: /certs/README.md');
        console.warn('   Exemplo disponível em: /certs/rootCA.crt.example');
        return null;
      }
    } catch (error) {
      console.error('❌ Erro ao carregar certificado da CA:', error);
      return null;
    }
  }
  
  /**
   * Cria um agente HTTPS configurado para certificados internos
   */
  static createHttpsAgent(): https.Agent | undefined {
    // Apenas no lado servidor (Node.js)
    if (typeof window !== 'undefined') {
      console.warn('⚠️  SSLConfig.createHttpsAgent() chamado no browser - ignorando');
      return undefined;
    }
    
    const caCert = this.loadCACertificate();
    
    if (caCert) {
      console.log('🔒 Criando agente HTTPS com certificado da CA interna');
      return new https.Agent({
        ca: caCert,
        rejectUnauthorized: true, // Manter segurança, mas confiar na CA interna
      });
    } else {
      // Em desenvolvimento, ser mais permissivo com certificados SSL
      console.warn('🔓 Certificado da CA não configurado');
      
      if (process.env.NODE_ENV === 'development') {
        console.warn('🔓 Modo desenvolvimento: criando agente que ignora certificados SSL não confiáveis');
        console.warn('   ATENÇÃO: Isso não é seguro para produção!');
        console.warn('   Para configurar SSL corretamente, veja /certs/README.md');
        
        return new https.Agent({
          rejectUnauthorized: false, // Ignorar verificação SSL em desenvolvimento
        });
      }
      
      // Em produção, falhar se não houver certificado
      const errorMsg = 'Certificado da CA interna não configurado. Para resolver:\n' +
                      '1. Obtenha o arquivo rootCA.crt do administrador de rede\n' +
                      '2. Coloque-o em /certs/rootCA.crt\n' +
                      '3. Veja instruções em /certs/README.md';
      throw new Error(errorMsg);
    }
  }
  
  /**
   * Verifica se o certificado está configurado corretamente
   */
  static verifyCertificateSetup(): boolean {
    try {
      const cert = this.loadCACertificate();
      return cert !== null && this.initialized;
    } catch (error) {
      console.error('Erro na verificação do certificado:', error);
      return false;
    }
  }
  
  /**
   * Retorna informações sobre o status da configuração SSL
   */
  static getStatus(): { configured: boolean; message: string; devMode?: boolean } {
    const cert = this.loadCACertificate();
    const isDev = process.env.NODE_ENV === 'development';
    
    if (cert && this.initialized) {
      return {
        configured: true,
        message: 'Certificado da CA interna configurado corretamente'
      };
    } else if (isDev) {
      return {
        configured: false,
        message: 'Certificado não configurado, mas modo desenvolvimento ativo (SSL ignorado)',
        devMode: true
      };
    } else {
      return {
        configured: false,
        message: 'Certificado da CA interna não configurado. Veja /certs/README.md'
      };
    }
  }
} 