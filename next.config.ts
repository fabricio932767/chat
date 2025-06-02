/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // IMPORTANTE: A URL do webhook DEVE ser configurada via variável de ambiente
    // Crie um arquivo .env.local na raiz do projeto com:
    // NEXT_PUBLIC_WEBHOOK_URL=sua_url_aqui
    NEXT_PUBLIC_WEBHOOK_URL: process.env.NEXT_PUBLIC_WEBHOOK_URL,
  },
};

export default nextConfig;
