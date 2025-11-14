import type { NextConfig } from "next";

const requiredEnvVars = [
  "PRISMA_DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "NEXT_PUBLIC_BASE_URL",
  "GOOGLE_CLIENT_ID",
  "KV_URL",
  "KV_REST_API_URL",
  "KV_REST_API_TOKEN",
  "KV_REST_API_READ_ONLY_TOKEN",
  "REDIS_URL",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables:\n${missingEnvVars
      .map((v) => `  - ${v}`)
      .join("\n")}`,
  );
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
