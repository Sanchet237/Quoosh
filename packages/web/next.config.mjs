const nextConfig = {
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,
  productionBrowserSourceMaps: false,
  transpilePackages: ["@quoosh/common", "@quoosh/socket", "@t3-oss/env-nextjs"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ]
  },
}
export default nextConfig
