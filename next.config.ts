import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // Disabled until Serwist supports Turbopack (Next.js 16 default)
  // See: https://github.com/serwist/serwist/issues/54
  // Re-enable in Phase 8 with --webpack flag or @serwist/turbopack
  disable: true,
});

const nextConfig: NextConfig = {
  turbopack: {},
};

export default withSerwist(nextConfig);
