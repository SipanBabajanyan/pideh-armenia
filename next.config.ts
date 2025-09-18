import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Отключаем ESLint во время сборки для продакшена
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Отключаем проверку типов во время сборки
    ignoreBuildErrors: true,
  },
};

export default nextConfig;