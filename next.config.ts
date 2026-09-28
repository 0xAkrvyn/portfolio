import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep old static-site URLs working (e.g. /about.html -> /about)
  async redirects() {
    return ["about", "services", "tools", "blog", "contact", "admin"]
      .map((p) => ({ source: `/${p}.html`, destination: `/${p}`, permanent: true }))
      .concat([{ source: "/index.html", destination: "/", permanent: true }]);
  },
};

export default nextConfig;
