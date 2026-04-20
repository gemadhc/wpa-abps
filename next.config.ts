import type { NextConfig } from "next";
import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  env: {
    SERVER: "https://sandbox.abps-erp.com/field",
    QUICKBOOKS: "https://sandbox.abps-erp.com/quickbooks",
    OFFICE: "https://sandbox.abps-erp.com/backflow",
    TOKEN_SERVER: "https://api.intuit.com/quickbooks/v4/payments/tokens",
    VISA_METHOD_REF: "9",
    CASH_METHOD_REF: "4",
    CHECK_METHOD_REF: "5",
    GOOGLE_API_KEY: "AIzaSyDDN477JYDDS-g_c3hLBxR3HEnqaGKSfFo",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    viewTransition: true,
  },
  reactStrictMode: true,
};

export default withPWA(nextConfig);