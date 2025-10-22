import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env:{
    SERVER: "https://abps-erp.com/field",
    QUICKBOOKS: "https://abps-erp/quickbooks"
  }
  eslint: {
        ignoreDuringBuilds: true,
    },
  typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
