import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      { protocol: "https", hostname: "api.kcvvelewijt.be", pathname: "/**" },
      { protocol: "https", hostname: "dfaozfi7c7f3s.cloudfront.net", pathname: "/**" },
    ],
  },
};

export default nextConfig;
