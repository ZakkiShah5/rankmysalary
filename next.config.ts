import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Old occupation slugs (before label changes) → correct slugs (301 permanent)
      // Wildcard covers both the occupation page and all state sub-pages
      // e.g. /salary/software-developers/california → /salary/software-developers-engineers/california
      {
        source: "/salary/software-developers/:path*",
        destination: "/salary/software-developers-engineers/:path*",
        permanent: true,
      },
      {
        source: "/salary/financial-analysts/:path*",
        destination: "/salary/financial-analysts-advisors/:path*",
        permanent: true,
      },
      // Common "and" slug variants (e.g. from external links that spelled out "&" as "and")
      {
        source: "/salary/general-and-operations-managers/:path*",
        destination: "/salary/general-operations-managers/:path*",
        permanent: true,
      },
      {
        source: "/salary/marketing-and-sales-managers/:path*",
        destination: "/salary/marketing-sales-managers/:path*",
        permanent: true,
      },
      {
        source: "/salary/it-and-technology-managers/:path*",
        destination: "/salary/it-technology-managers/:path*",
        permanent: true,
      },
      {
        source: "/salary/software-developers-and-engineers/:path*",
        destination: "/salary/software-developers-engineers/:path*",
        permanent: true,
      },
      {
        source: "/salary/financial-analysts-and-advisors/:path*",
        destination: "/salary/financial-analysts-advisors/:path*",
        permanent: true,
      },
      {
        source: "/salary/data-scientists-and-ml-engineers/:path*",
        destination: "/salary/data-scientists-ml-engineers/:path*",
        permanent: true,
      },
      {
        source: "/salary/network-and-systems-administrators/:path*",
        destination: "/salary/network-systems-administrators/:path*",
        permanent: true,
      },
      {
        source: "/salary/civil-and-structural-engineers/:path*",
        destination: "/salary/civil-structural-engineers/:path*",
        permanent: true,
      },
      {
        source: "/salary/electrical-and-electronics-engineers/:path*",
        destination: "/salary/electrical-electronics-engineers/:path*",
        permanent: true,
      },
      {
        source: "/salary/industrial-and-manufacturing-engineers/:path*",
        destination: "/salary/industrial-manufacturing-engineers/:path*",
        permanent: true,
      },
      {
        source: "/salary/top-executives-and-ceos/:path*",
        destination: "/salary/top-executives-ceos/:path*",
        permanent: true,
      },
      {
        source: "/salary/physicians-and-surgeons/:path*",
        destination: "/salary/physicians-surgeons/:path*",
        permanent: true,
      },
      {
        source: "/salary/registered-nurses-and-rns/:path*",
        destination: "/salary/registered-nurses/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
