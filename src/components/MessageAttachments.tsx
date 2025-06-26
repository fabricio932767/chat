"use client";

import { FileAttachment } from '@/types/chat';

interface MessageAttachmentsProps {
  attachments: FileAttachment[];
}

const MessageAttachments = ({ attachments }: MessageAttachmentsProps) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="attachment-icon">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 8.11,16.5 8.24,15.98C8.32,15.65 8.16,15.26 8.1,14.97C8.04,14.67 8.18,14.11 8.24,13.81C8.29,13.5 8.29,13.18 8.34,12.87C8.39,12.56 8.46,12.17 8.55,11.88C8.64,11.58 8.83,11.27 8.91,10.97C8.99,10.67 8.94,10.35 9.04,10.6C9.13,9.75 9.46,8.96 9.78,8.2C10.1,7.44 10.58,6.68 11.16,6.2C11.74,5.72 12.5,5.45 13.76,5.17C14.76,4.95 16.1,4.6 17.11,5.17C17.6,5.44 17.96,5.95 18.08,6.5C18.2,7.05 18.1,7.65 17.94,8.15C17.77,8.65 17.5,9.06 17.21,9.44C16.92,9.82 16.62,10.15 16.25,10.39C15.87,10.63 15.41,10.8 14.97,10.85C14.52,10.9 14.05,10.85 13.6,10.85C13.15,10.85 12.71,10.9 12.29,11C11.86,11.1 11.46,11.25 11.11,11.44C10.76,11.63 10.46,11.86 10.21,12.13C9.96,12.4 9.75,12.71 9.6,13.04C9.45,13.37 9.35,13.72 9.3,14.07C9.25,14.42 9.25,14.78 9.3,15.13C9.35,15.48 9.45,15.83 9.6,16.16C9.75,16.49 9.96,16.8 10.21,17.07C10.46,17.34 10.76,17.57 11.11,17.76C11.46,17.95 11.86,18.1 12.29,18.2C12.71,18.3 13.15,18.35 13.6,18.35C14.05,18.35 14.52,18.3 14.97,18.35C15.41,18.4 15.87,18.57 16.25,18.81C16.62,19.05 16.92,19.38 17.21,19.76C17.5,20.14 17.77,20.55 17.94,21.05C18.1,21.55 18.2,22.15 18.08,22.7C17.96,23.25 17.6,23.76 17.11,24.03C16.1,24.6 14.76,24.25 13.76,24.03C12.5,23.75 11.74,23.48 11.16,23C10.58,22.52 10.1,21.76 9.78,21C9.46,20.24 9.13,19.45 9.04,18.6C8.94,18.85 8.99,18.53 8.91,18.23C8.83,17.93 8.64,17.62 8.55,17.32C8.46,17.03 8.39,16.64 8.34,16.33C8.29,16.02 8.29,15.7 8.24,15.39C8.18,15.09 8.04,14.53 8.1,14.23C8.16,13.94 8.32,13.55 8.24,13.22C8.11,12.7 7.5,11.82 7.07,10.92C6.64,10.02 6.36,9.06 6.36,8.14C6.36,7.22 6.64,6.26 7.07,5.36C7.5,4.46 8.11,3.58 8.24,3.06C8.32,2.73 8.16,2.34 8.1,2.05C8.04,1.75 8.18,1.19 8.24,0.89C8.29,0.58 8.29,0.26 8.34,0C8.39,-0.26 8.46,-0.65 8.55,-0.94C8.64,-1.24 8.83,-1.55 8.91,-1.85C8.99,-2.15 8.94,-2.47 9.04,-2.22C9.13,-3.07 9.46,-3.86 9.78,-4.62C10.1,-5.38 10.58,-6.14 11.16,-6.62C11.74,-7.1 12.5,-7.37 13.76,-7.65Z" />
        </svg>
      );
    } else if (mimeType.includes('sheet') || mimeType.includes('excel')) {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="attachment-icon">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z M10.5,11.5L9.5,13L10.5,14.5V16H9L8.1,14.8L7.2,16H5.7V14.5L6.7,13L5.7,11.5V10H7.2L8.1,11.2L9,10H10.5V11.5Z" />
        </svg>
      );
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="attachment-icon">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z M7,11H17V13H7V11Z M7,15H17V17H7V15Z" />
        </svg>
      );
    } else {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="attachment-icon">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      );
    }
  };

  return (
    <div className="message-attachments">
      {attachments.map((attachment) => (
        <div key={attachment.id} className="attachment-item">
          {getFileIcon(attachment.type)}
          <div className="attachment-info">
            <div className="attachment-name" title={attachment.name}>
              {attachment.name}
            </div>
            <div className="attachment-size">
              {formatFileSize(attachment.size)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageAttachments; 