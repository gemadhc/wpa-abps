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
    GET_FILES: "https://default23ee31ddf4fb4382aa7b4ac682d35a.71.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/ca19ecbc37f14337a0fa3628bc992315/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2_ZhA2kqFd02wO3naJCRZ3X33g4494ihGTMrQX2YuXc", 
    GET_LINK: "https://default23ee31ddf4fb4382aa7b4ac682d35a.71.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/ac6eca14d9444001b88c052545e3ef13/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=NB-CWZzK3kZgAs68-8lQe780V3oWpL1NhK6wdiuiI7w"
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