import type { NextConfig } from "next";
import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true, 
  skipWaiting:true, 
  runtimeCaching: [
    // 1. Next data
    {
      urlPattern: /_next\/data\/.*\.json/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-data-cache',
      },
    },

    // 2. JS chunks (CRITICAL)
    {
      urlPattern: /\/_next\/static\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static-cache',
      },
    },

    // 3. Navigation fallback
    {
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages-cache',
        plugins: [
          {
            handlerDidError: async () => caches.match('/'),
          },
        ],
      },
    },
  ], 
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  env: {
    SERVER: "https://server.abps-erp.com/field",
    QUICKBOOKS: "https://server.abps-erp.com/quickbooks",
    OFFICE: "https://server.abps-erp.com/backflow",
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