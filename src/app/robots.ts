import type { MetadataRoute } from "next";
import { site, isPlaceholder } from "@content/site";

const base = isPlaceholder(site.url) ? "http://localhost:3000" : site.url;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      // 显式放行百度。技术上本站已是服务端渲染，百度可正常抓取，
      // 不需要为它做额外的预渲染改造 —— 要做的只是提交侧的适配。
      { userAgent: "Baiduspider", allow: "/" },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
