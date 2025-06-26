"use client";

import { FileAttachment, FileUploadResponse } from '@/types/chat';
import { useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileProcessed: (attachment: FileAttachment) => void;
  isDisabled?: boolean;
}

const FileUpload = ({ onFileProcessed, isDisabled = false }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<void> => {
    console.log('📁 FileUpload: Iniciando upload do arquivo:', {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeFormatted: `${(file.size / 1024 / 1024).toFixed(2)}MB`
    });

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('📤 FileUpload: Enviando requisição para /api/upload...');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('📥 FileUpload: Resposta recebida:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      const result: FileUploadResponse = await response.json();
      console.log('📋 FileUpload: Dados da resposta:', result);

      if (response.ok && result.success && result.file) {
        console.log('✅ FileUpload: Upload bem-sucedido!');
        onFileProcessed(result.file);
      } else {
        const errorMessage = result.error || `Erro HTTP ${response.status}: ${response.statusText}`;
        console.error('❌ FileUpload: Erro no upload:', errorMessage);
        console.error('📊 FileUpload: Detalhes do erro:', result);
        setError(errorMessage);
      }
    } catch (error) {
      console.error('❌ FileUpload: Erro de rede/exceção:', error);
      
      // Mostrar erro mais específico
      const errorMessage = error instanceof Error 
        ? `Erro de rede: ${error.message}` 
        : 'Erro ao enviar arquivo. Tente novamente.';
      
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    console.log('📂 FileUpload: Arquivos soltos:', {
      accepted: acceptedFiles.length,
      rejected: rejectedFiles.length
    });

    if (rejectedFiles.length > 0) {
      console.error('❌ FileUpload: Arquivos rejeitados:', rejectedFiles);
      const rejectedFile = rejectedFiles[0];
      
      if (rejectedFile.errors) {
        const errorMessages = rejectedFile.errors.map((e) => {
          switch (e.code) {
            case 'file-too-large':
              return 'Arquivo muito grande (máximo 50MB)';
            case 'file-invalid-type':
              return 'Tipo de arquivo não suportado';
            case 'too-many-files':
              return 'Apenas um arquivo por vez';
            default:
              return e.message;
          }
        });
        setError(errorMessages.join(', '));
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      uploadFile(acceptedFiles[0]);
    }
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      // PDFs
      'application/pdf': ['.pdf'],
      // Word
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      // Excel
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      // Texto
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      // RTF
      'application/rtf': ['.rtf'],
      'text/rtf': ['.rtf'],
      // PowerPoint
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      // Imagens
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/bmp': ['.bmp'],
      'image/tiff': ['.tiff']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: isDisabled || uploading,
  });

  return (
    <div className="file-upload-container">
      <div
        {...getRootProps()}
        className={`file-dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''} ${isDisabled ? 'disabled' : ''}`}
      >
        <input {...getInputProps()} />
        
        <div className="file-upload-content">
          {uploading ? (
            <>
              <div className="upload-spinner">
                <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="31.416" strokeDashoffset="31.416" />
                </svg>
              </div>
              <p>Processando arquivo...</p>
            </>
          ) : isDragActive ? (
            <>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
              <p>Solte o arquivo aqui</p>
            </>
          ) : (
            <>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
              <p>
                <strong>Clique para selecionar</strong> ou arraste um arquivo
              </p>
              <p className="file-types">PDF, Word, Excel, PowerPoint, TXT, CSV, RTF, Imagens</p>
              <p className="file-size">Tamanho máximo: 50MB</p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="file-upload-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z" />
          </svg>
          {error}
          <button 
            onClick={() => setError(null)}
            className="error-close-btn"
            type="button"
            aria-label="Fechar erro"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 