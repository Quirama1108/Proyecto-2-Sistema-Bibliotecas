import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.env.VERCEL ? path.resolve(__dirname, "..") : __dirname
  }
};

export default nextConfig;
