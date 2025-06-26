import { FileAttachment, FileUploadResponse } from '@/types/chat';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Sem necessidade de importações de processamento - arquivo será enviado como base64

export async function POST(request: NextRequest) {
  console.log('📁 API Upload: Recebendo requisição de upload...');
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    console.log('📄 Arquivo recebido:', file ? {
      name: file.name,
      type: file.type,
      size: file.size
    } : 'Nenhum arquivo');

    if (!file) {
      console.error('❌ Nenhum arquivo foi enviado');
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      );
    }

    // Tipos de arquivo permitidos - validação básica apenas
    const allowedTypes = [
      // PDFs
      'application/pdf',
      // Word
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      // Excel
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      // Texto
      'text/plain', // .txt
      'text/csv', // .csv
      // Outros formatos comuns
      'application/rtf', // .rtf
      'text/rtf', // .rtf (alternativo)
      // PowerPoint
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'application/vnd.ms-powerpoint', // .ppt
      // Imagens (para OCR no N8N se necessário)
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      // Fallback
      'application/octet-stream'
    ];

    console.log('🔍 Validando tipo de arquivo:', file.type);
    
    // Verificação flexível baseada na extensão
    const fileName = file.name.toLowerCase();
    const allowedExtensions = [
      '.pdf', '.docx', '.doc', '.xlsx', '.xls', '.txt', '.csv', '.rtf', 
      '.pptx', '.ppt', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'
    ];
    
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!allowedTypes.includes(file.type) && !hasValidExtension) {
      console.error('❌ Tipo de arquivo não suportado:', file.type, 'Nome:', file.name);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tipo de arquivo não suportado. Envie: PDF, Word, Excel, PowerPoint, TXT, CSV, RTF ou imagens' 
        },
        { status: 400 }
      );
    }

    // Validação do tamanho (50MB máximo para suportar documentos grandes)
    const maxSize = 50 * 1024 * 1024; // 50MB
    console.log('📊 Validando tamanho do arquivo:', `${(file.size / 1024 / 1024).toFixed(2)}MB`);
    if (file.size > maxSize) {
      console.error('❌ Arquivo muito grande:', `${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return NextResponse.json(
        { success: false, error: 'Arquivo muito grande. Tamanho máximo: 50MB' },
        { status: 400 }
      );
    }

    console.log('🔄 Convertendo arquivo para base64...');
    // Converter File para Buffer e depois para base64 - SEM PROCESSAR O CONTEÚDO
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Content = buffer.toString('base64');
    
    console.log('✅ Arquivo convertido para base64, tamanho:', base64Content.length, 'caracteres');

    // Detectar categoria do arquivo para o N8N
    const fileCategory = detectFileCategory(file.type, fileName);
    
    // Criar objeto de anexo COM O ARQUIVO ORIGINAL EM BASE64
    const attachment: FileAttachment = {
      id: uuidv4(),
      name: file.name,
      type: file.type,
      size: file.size,
      content: base64Content, // ARQUIVO ORIGINAL EM BASE64
      category: fileCategory, // Categoria para ajudar o N8N a processar
      originalFileName: file.name,
      base64: base64Content // Duplicado para clareza
    };

    const response: FileUploadResponse = {
      success: true,
      file: attachment
    };

    console.log('✅ Upload processado com sucesso (arquivo original em base64):', {
      id: attachment.id,
      name: attachment.name,
      category: fileCategory,
      base64Length: base64Content.length,
      originalSize: file.size
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Erro no upload:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}

/**
 * Detecta a categoria do arquivo para ajudar o N8N a processar
 */
function detectFileCategory(mimeType: string, fileName: string): string {
  const fileNameLower = fileName.toLowerCase();
  
  // PDF
  if (mimeType === 'application/pdf' || fileNameLower.endsWith('.pdf')) {
    return 'pdf';
  }
  
  // Word
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword' ||
      fileNameLower.endsWith('.docx') || fileNameLower.endsWith('.doc')) {
    return 'word';
  }
  
  // Excel
  if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      mimeType === 'application/vnd.ms-excel' ||
      fileNameLower.endsWith('.xlsx') || fileNameLower.endsWith('.xls')) {
    return 'excel';
  }
  
  // PowerPoint
  if (mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      mimeType === 'application/vnd.ms-powerpoint' ||
      fileNameLower.endsWith('.pptx') || fileNameLower.endsWith('.ppt')) {
    return 'powerpoint';
  }
  
  // Texto
  if (mimeType === 'text/plain' || mimeType === 'text/csv' ||
      fileNameLower.endsWith('.txt') || fileNameLower.endsWith('.csv')) {
    return 'text';
  }
  
  // RTF
  if (mimeType === 'application/rtf' || mimeType === 'text/rtf' ||
      fileNameLower.endsWith('.rtf')) {
    return 'rtf';
  }
  
  // Imagens
  if (mimeType.startsWith('image/') || 
      ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'].some(ext => fileNameLower.endsWith(ext))) {
    return 'image';
  }
  
  return 'unknown';
} 