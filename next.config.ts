import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env:{
    SERVER: "https://abps-erp.com/field",
    QUICKBOOKS: "https://abps-erp.com/quickbooks", 
    OFFICE: "https://abps-erp.com/backflow",
  },
  eslint: {
        ignoreDuringBuilds: true,
    },
  typescript: {
        ignoreBuildErrors: true,
    },

};

export default nextConfig;
