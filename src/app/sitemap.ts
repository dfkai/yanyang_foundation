import type { MetadataRoute } from "next";
import { pages } from "@content/pages";
import { site, isPlaceholder } from "@content/site";

const base = isPlaceholder(site.url) ? "http://localhost:3000" : site.url;

/**
 * 站点地图
 * ---------------------------------------------------------------------------
 * 刻意用扁平单文件而不是索引型（sitemap of sitemaps）：百度明确不受理索引型
 * sitemap，且站内存在索引型文件时会禁止提交新文件。Google 两种都吃，所以
 * 扁平是唯一同时满足两家的形态。本站规模远低于单文件 5 万 URL 的上限。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const priority: Record<string, number> = {
    "/": 1,
    "/programs": 0.9,
    "/disclosure": 0.9,
    "/about": 0.8,
    "/impact": 0.8,
  };

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...Object.keys(pages).map((p) => ({
      url: `${base}${p}`,
      lastModified: now,
      changeFrequency: p.startsWith("/news") ? ("weekly" as const) : ("monthly" as const),
      priority: priority[p] ?? 0.6,
    })),
  ];
}
