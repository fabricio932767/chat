/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_WEBHOOK_URL: process.env.NEXT_PUBLIC_WEBHOOK_URL,
  },
  experimental: {
    allowedDevOrigins: [
      'http://localhost:3000', // Acesso local
      'http://172.19.1.56',    // IP da sua rede local (como apareceu no terminal)
    ]
  }
};

export default nextConfig;
