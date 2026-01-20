import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // MVP：避免 Next 在 build 阶段因 ESLint 版本兼容问题阻断构建
    ignoreDuringBuilds: true
  }
};

export default nextConfig;


