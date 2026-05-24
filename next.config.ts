import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Old broken footer/bookmark URLs → correct slugs (301 permanent)
      {
        source: "/salary/software-developers",
        destination: "/salary/software-developers-engineers",
        permanent: true,
      },
      {
        source: "/salary/financial-analysts",
        destination: "/salary/financial-analysts-advisors",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
