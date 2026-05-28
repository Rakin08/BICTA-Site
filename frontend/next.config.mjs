/** @type {import('next').NextConfig} */
const nextConfig = {
  // IMPORTANT: output standalone enables Docker deployment
  // Comment this out if deploying to Vercel (Vercel doesn't need it)
  // output: "standalone",  // <-- uncomment ONLY for Docker deployment
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "**.vercel.app" },
      { protocol: "https", hostname: "**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
