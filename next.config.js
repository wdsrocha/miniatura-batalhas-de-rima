/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["raw.githubusercontent.com"],
  },
  env: {
    // Exposed to the client so a diagnostics report says exactly which deploy
    // produced it. Set automatically on Vercel builds.
    NEXT_PUBLIC_COMMIT_SHA:
      process.env.VERCEL_GIT_COMMIT_SHA || process.env.COMMIT_SHA || "",
  },
};

module.exports = nextConfig;
