import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env:{
    SERVER: "http://localhost:8080/field",
    QUICKBOOKS: "http://localhost:8080/quickbooks", 
    OFFICE: "http://localhost:8080/backflow",
    TOKEN_SERVER : "https://sandbox.api.intuit.com/quickbooks/v4/payments/tokens", 
    VISA_METHOD_REF: "3", /* 9 for production and 3 for sandbox*/
    CASH_METHOD_REF: "1", 
    CHECK_METHOD_REF: "2", 
    GOOGLE_API_KEY: "AIzaSyDDN477JYDDS-g_c3hLBxR3HEnqaGKSfFo",
    MAX_WAYPOINTS: 23
  },
  eslint: {
        ignoreDuringBuilds: true,
    },
  typescript: {
        ignoreBuildErrors: true,
    },

};

export default nextConfig;