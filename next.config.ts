/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_WEBHOOK_URL: process.env.NEXT_PUBLIC_WEBHOOK_URL,
  },
  experimental: {
    allowedDevOrigins: [
      'http://localhost:3000', // Acesso local
      'http://10.81.234.194/',  // IP da sua rede local (como apareceu no terminal)
    ]
  },
  // Desabilitar completamente overlays de desenvolvimento
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Desabilitar Turbopack indicators
  turbo: {
    rules: {
      '*.css': ['css-loader'],
    },
  },
  // Desabilitar webpack build indicators
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = false;
    }
    return config;
  },
};

export default nextConfig;
