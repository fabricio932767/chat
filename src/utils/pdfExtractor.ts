/**
 * Função utilitária para lidar com PDFs
 * Como não temos uma biblioteca confiável para extração de texto,
 * vamos aceitar o PDF e orientar o usuário a copiar o texto manualmente
 */

/**
 * Extrai "texto" de um PDF a partir de conteúdo base64
 * Na verdade, retorna uma mensagem orientando o usuário
 * @param base64 Conteúdo do PDF em base64
 * @param fileName Nome do arquivo PDF
 * @returns Mensagem explicativa para o usuário
 */
export async function extractTextFromBase64PDF(base64: string, fileName: string): Promise<string> {
  console.log('📄 Processando PDF:', fileName);
  
  try {
    // Converter base64 para Buffer para validar
    const buffer = Buffer.from(base64, 'base64');
    console.log('✅ Buffer criado a partir do base64, tamanho:', buffer.length);
    
    // Verificar se é um PDF válido
    if (!isValidPDFBuffer(buffer)) {
      throw new Error('Arquivo não é um PDF válido');
    }
    
    // Retornar instrução para o usuário
    const instruction = createPDFInstructionMessage(fileName, buffer.length);
    console.log('📝 Instrução criada para o usuário');
    
    return instruction;
  } catch (error) {
    console.error('❌ Erro ao processar PDF:', error);
    throw new Error(`Falha ao processar PDF: ${(error as Error).message}`);
  }
}

/**
 * Extrai "texto" de um PDF a partir de Buffer
 * Na verdade, retorna uma mensagem orientando o usuário
 * @param buffer Buffer contendo os dados do PDF
 * @param fileName Nome do arquivo PDF
 * @returns Mensagem explicativa para o usuário
 */
export async function extractTextFromPDFBuffer(buffer: Buffer, fileName: string): Promise<string> {
  console.log('📄 Processando PDF buffer:', fileName);
  
  try {
    // Verificar se é um PDF válido
    if (!isValidPDFBuffer(buffer)) {
      throw new Error('Arquivo não é um PDF válido');
    }
    
    // Retornar instrução para o usuário
    const instruction = createPDFInstructionMessage(fileName, buffer.length);
    console.log('📝 Instrução criada para o usuário');
    
    return instruction;
  } catch (error) {
    console.error('❌ Erro ao processar PDF:', error);
    throw new Error(`Falha ao processar PDF: ${(error as Error).message}`);
  }
}

/**
 * Verifica se um buffer contém um PDF válido
 * @param buffer Buffer a ser verificado
 * @returns true se for um PDF válido
 */
export function isValidPDFBuffer(buffer: Buffer): boolean {
  try {
    // Verificar header do PDF
    const header = buffer.slice(0, 5).toString();
    return header.startsWith('%PDF');
  } catch {
    return false;
  }
}

/**
 * Cria uma mensagem de instrução para o usuário sobre como proceder com o PDF
 * @param fileName Nome do arquivo
 * @param bufferSize Tamanho do buffer
 * @returns Mensagem formatada
 */
function createPDFInstructionMessage(fileName: string, bufferSize: number): string {
  return `📄 DOCUMENTO PDF: "${fileName}"

✅ PDF RECEBIDO COM SUCESSO!

📊 INFORMAÇÕES DO ARQUIVO:
- Nome: ${fileName}
- Tamanho: ${(bufferSize / 1024).toFixed(1)} KB
- Formato: PDF
- Status: Arquivo válido recebido

💡 COMO PROCEDER:
Para que eu possa analisar o conteúdo deste PDF, você pode:

1. 📋 Abrir o PDF em um leitor (Adobe Reader, Chrome, etc.)
2. 📄 Copiar o texto relevante que deseja analisar
3. 💬 Colar o texto diretamente neste chat
4. 🤖 Fazer sua pergunta sobre o conteúdo

🔄 ALTERNATIVA:
- Converter o PDF para Word (.docx) e enviar novamente
- Usar uma ferramenta online de PDF para texto
- Fazer screenshot do texto e descrever o que precisa

📝 EXEMPLO DE USO:
Depois de copiar o texto, você pode dizer:
"Analise este texto do PDF: [texto copiado aqui]"
"Faça um resumo deste documento: [texto copiado aqui]"
"Extraia os pontos principais: [texto copiado aqui]"

Estou pronto para ajudar assim que você fornecer o conteúdo! 🚀`;
} 