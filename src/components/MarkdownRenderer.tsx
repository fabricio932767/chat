"use client";

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  isDarkTheme?: boolean;
}

const MarkdownRenderer = ({ content, isDarkTheme = false }: MarkdownRendererProps) => {
  return (
    <div className={`markdown-content ${isDarkTheme ? 'dark' : ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Renderização customizada de código
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            return !inline && language ? (
              <SyntaxHighlighter
                style={isDarkTheme ? oneDark : undefined}
                language={language}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          
          // Renderização customizada de listas ordenadas
          ol({ children, ...props }) {
            return (
              <ol className="markdown-ordered-list" {...props}>
                {children}
              </ol>
            );
          },
          
          // Renderização customizada de listas não ordenadas
          ul({ children, ...props }) {
            return (
              <ul className="markdown-unordered-list" {...props}>
                {children}
              </ul>
            );
          },
          
          // Renderização customizada de itens de lista
          li({ children, ...props }) {
            return (
              <li className="markdown-list-item" {...props}>
                {children}
              </li>
            );
          },
          
          // Renderização customizada de tabelas
          table({ children, ...props }) {
            return (
              <div className="markdown-table-wrapper">
                <table className="markdown-table" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          
          // Renderização customizada de cabeçalhos de tabela
          thead({ children, ...props }) {
            return (
              <thead className="markdown-table-head" {...props}>
                {children}
              </thead>
            );
          },
          
          // Renderização customizada de corpo de tabela
          tbody({ children, ...props }) {
            return (
              <tbody className="markdown-table-body" {...props}>
                {children}
              </tbody>
            );
          },
          
          // Renderização customizada de linhas de tabela
          tr({ children, ...props }) {
            return (
              <tr className="markdown-table-row" {...props}>
                {children}
              </tr>
            );
          },
          
          // Renderização customizada de células de tabela
          td({ children, ...props }) {
            return (
              <td className="markdown-table-cell" {...props}>
                {children}
              </td>
            );
          },
          
          // Renderização customizada de células de cabeçalho
          th({ children, ...props }) {
            return (
              <th className="markdown-table-header" {...props}>
                {children}
              </th>
            );
          },
          
          // Renderização customizada de parágrafos
          p({ children, ...props }) {
            return (
              <p className="markdown-paragraph" {...props}>
                {children}
              </p>
            );
          },
          
          // Renderização customizada de cabeçalhos
          h1({ children, ...props }) {
            return (
              <h1 className="markdown-heading-1" {...props}>
                {children}
              </h1>
            );
          },
          
          h2({ children, ...props }) {
            return (
              <h2 className="markdown-heading-2" {...props}>
                {children}
              </h2>
            );
          },
          
          h3({ children, ...props }) {
            return (
              <h3 className="markdown-heading-3" {...props}>
                {children}
              </h3>
            );
          },
          
          h4({ children, ...props }) {
            return (
              <h4 className="markdown-heading-4" {...props}>
                {children}
              </h4>
            );
          },
          
          h5({ children, ...props }) {
            return (
              <h5 className="markdown-heading-5" {...props}>
                {children}
              </h5>
            );
          },
          
          h6({ children, ...props }) {
            return (
              <h6 className="markdown-heading-6" {...props}>
                {children}
              </h6>
            );
          },
          
          // Renderização customizada de texto em negrito
          strong({ children, ...props }) {
            return (
              <strong className="markdown-bold" {...props}>
                {children}
              </strong>
            );
          },
          
          // Renderização customizada de texto em itálico
          em({ children, ...props }) {
            return (
              <em className="markdown-italic" {...props}>
                {children}
              </em>
            );
          },
          
          // Renderização customizada de citações
          blockquote({ children, ...props }) {
            return (
              <blockquote className="markdown-blockquote" {...props}>
                {children}
              </blockquote>
            );
          },
          
          // Renderização customizada de código inline
          inlineCode({ children, ...props }) {
            return (
              <code className="markdown-inline-code" {...props}>
                {children}
              </code>
            );
          },
          
          // Renderização customizada de links
          a({ children, href, ...props }) {
            return (
              <a 
                className="markdown-link" 
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
          
          // Renderização customizada de quebras de linha
          hr({ ...props }) {
            return <hr className="markdown-divider" {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 