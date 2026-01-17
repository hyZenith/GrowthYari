import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Workaround: Your local ISP resolves Supabase to a NAT64 IP (64:ff9b::), which Next.js blocks as "Private".
    // We disable optimization locally so you can see images. Production will still optimize & cache.
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ypmwaawygmwytaxkhfbr.supabase.co",
      },
    ],
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'User-Agent',
            value: '.*(bytespider|semrushbot|mj12bot|dotbot|ahrefsbot|petalbot|zoominfobot|magpie-crawler).*',
          },
        ],
        destination: 'https://google.com', // Send them away
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
