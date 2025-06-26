#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

/**
 * Script para diagnosticar problemas de SSL com certificados internos
 */

const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || 'https://n8ndev.intranet.wdcnet/webhook/chat-test';
const CERT_PATH = path.join(__dirname, '..', 'certs', 'rootCA.crt');

console.log('🔍 Diagnóstico SSL para certificados internos\n');

// 1. Verificar se a URL está configurada
console.log('1. Verificando configuração...');
console.log(`   URL do webhook: ${WEBHOOK_URL}`);

if (!WEBHOOK_URL.startsWith('https://')) {
  console.log('ℹ️  URL não usa HTTPS - diagnóstico SSL não necessário');
  process.exit(0);
}

// 2. Verificar se o certificado existe
console.log('\n2. Verificando certificado da CA...');
if (fs.existsSync(CERT_PATH)) {
  console.log('✅ Certificado encontrado:', CERT_PATH);
  
  const certContent = fs.readFileSync(CERT_PATH, 'utf8');
  console.log(`   Tamanho: ${certContent.length} caracteres`);
  
  // Verificar se parece com um certificado válido
  if (certContent.includes('-----BEGIN CERTIFICATE-----')) {
    console.log('✅ Formato do certificado parece válido');
  } else {
    console.log('❌ Formato do certificado pode estar incorreto');
  }
} else {
  console.log('❌ Certificado não encontrado:', CERT_PATH);
  console.log('   Para configurar: consulte /certs/README.md');
}

// 3. Testar conexão SSL
console.log('\n3. Testando conexão SSL...');

const url = new URL(WEBHOOK_URL);

function testConnection(options, label) {
  return new Promise((resolve) => {
    console.log(`\n   ${label}:`);
    
    const req = https.request({
      hostname: url.hostname,
      port: url.port || 443,
      path: '/',
      method: 'GET',
      ...options
    }, (res) => {
      console.log(`   ✅ Conexão bem-sucedida (Status: ${res.statusCode})`);
      console.log(`   📋 Certificado: ${res.socket.getPeerCertificate().subject?.CN || 'N/A'}`);
      resolve(true);
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ Erro: ${error.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('   ⏱️  Timeout na conexão');
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

async function runTests() {
  // Teste 1: Sem certificado personalizado
  const test1 = await testConnection({
    rejectUnauthorized: true
  }, 'Teste com validação SSL padrão');
  
  // Teste 2: Com certificado da CA (se disponível)
  if (fs.existsSync(CERT_PATH)) {
    const caCert = fs.readFileSync(CERT_PATH, 'utf8');
    const test2 = await testConnection({
      ca: caCert,
      rejectUnauthorized: true
    }, 'Teste com certificado da CA interna');
  }
  
  // Teste 3: Ignorando validação SSL (para comparação)
  const test3 = await testConnection({
    rejectUnauthorized: false
  }, 'Teste ignorando validação SSL');
  
  console.log('\n📊 Resumo dos testes:');
  if (test1) {
    console.log('✅ SSL padrão funciona - certificado confiável pelo sistema');
  } else {
    console.log('❌ SSL padrão falha - necessária configuração de CA');
  }
  
  console.log('\n💡 Recomendações:');
  if (!fs.existsSync(CERT_PATH)) {
    console.log('1. Obtenha o certificado da CA interna');
    console.log('2. Coloque em /certs/rootCA.crt');
    console.log('3. Consulte /certs/README.md para instruções');
  } else {
    console.log('1. Certificado configurado corretamente');
    console.log('2. Reinicie a aplicação se necessário');
  }
}

runTests().catch(console.error); 