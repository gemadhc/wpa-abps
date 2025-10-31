import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env:{
    SERVER: "https://abps-erp.com/field",
    QUICKBOOKS: "https://abps-erp.com/quickbooks", 
    OFFICE: "https://abps-erp.com/backflow",
    TOKEN_SERVER : "https://api.intuit.com/quickbooks/v4/payments/tokens", 
    PAYMENT_METHOD_REF: "9", /* 9 for production and 3 for sandbox*/
  },
  eslint: {
        ignoreDuringBuilds: true,
    },
  typescript: {
        ignoreBuildErrors: true,
    },

};

export default nextConfig;
