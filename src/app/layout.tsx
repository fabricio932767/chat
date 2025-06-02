import 'bootstrap/dist/css/bootstrap.min.css';
import type { Metadata } from 'next';
import { BootstrapClient } from './bootstrap-client';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chat do Fabricio',
  description: 'Interface de chat para comunicação com o servidor n8n',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="chat-page-body">
        <BootstrapClient />
        {children}
      </body>
    </html>
  );
}
