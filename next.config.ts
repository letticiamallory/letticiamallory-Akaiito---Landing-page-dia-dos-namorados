import type { NextConfig } from "next";
import path from "node:path";

const watchIgnored = [
  "**/node_modules/**",
  "**/.git/**",
  "**/.next/**",
  "**/.tmp-pptx/**",
  "**/.tmp-pptx-new/**",
  "**/.tmp-pptx.zip",
  "**/data/**",
  "**/public/uploads/**",
  "**/scripts/**",
  "**/drizzle/**",
];

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "framer-motion",
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: watchIgnored,
      };
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: "/criar/carta",
        destination: "/criar/historia",
        permanent: false,
      },
      {
        source: "/criar/museu",
        destination: "/criar/historia",
        permanent: false,
      },
      {
        source: "/criar/chocolates",
        destination: "/criar/historia",
        permanent: false,
      },
      {
        source: "/criar/polaroid",
        destination: "/criar/historia",
        permanent: false,
      },
      {
        source: "/criar/joguinho",
        destination: "/criar/historia",
        permanent: false,
      },
      {
        source: "/criar/slot",
        destination: "/criar/historia",
        permanent: false,
      },
      {
        source: "/criar/kit",
        destination: "/criar/historia",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
