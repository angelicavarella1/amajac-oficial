import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.68.100", "localhost"],
  turbopack: {
    root: path.resolve("."),
  },
};

export default nextConfig;
