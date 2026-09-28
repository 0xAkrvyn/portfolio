import type { MetadataRoute } from "next";

const BASE = "https://akrvyensec.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, priority: 1 },
    { url: `${BASE}/about` },
    { url: `${BASE}/services` },
    { url: `${BASE}/tools` },
    { url: `${BASE}/blog` },
    { url: `${BASE}/contact` },
  ];
}
