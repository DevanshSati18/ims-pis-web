import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'https://api-ims.pisggn.com/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
