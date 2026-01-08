import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../..'), // Go up two levels from app-lumatienda to /root
  /* config options here */
};

export default nextConfig;
