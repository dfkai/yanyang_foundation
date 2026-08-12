import type { Metadata, Viewport } from "next";
import { displayFont, quoteFont } from "./fonts";
import { site, isPlaceholder } from "@content/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RevealObserver } from "@/components/reveal-observer";
import { PaperFilters } from "@/components/paper-filters";
import { displayPrefsScript } from "@/components/display-prefs";
import "./globals.css";

// site.url 在基金会确认域名前是占位符，new URL() 会抛错 —— 本地开发时退回 localhost。
const siteUrl = isPlaceholder(site.url) ? "http://localhost:3000" : site.url;

export const metadata: Metadata = {
  // 必设：否则 OG 图用相对路径时不会被解析成绝对 URL，社交平台抓不到图
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} | ${isPlaceholder(site.tagline) ? "公益基金会" : site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: isPlaceholder(site.description)
    ? `${site.name}官方网站`
    : site.description,
  alternates: {
    canonical: "./", // 自引用 canonical
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: site.name,
    url: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// themeColor / viewport 必须走独立导出，塞进 metadata 里不生效
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#14100e" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // lang 用 zh-Hans（脚本码，语义是「简体中文」），比地区码 zh-CN 更正确。
    // Next 16 移除了自动注入的 scroll-behavior: smooth，需显式声明。
    // suppressHydrationWarning 是必需的而不是偷懒：下面那段内联脚本会在首帧前
    // 往 <html> 上写 data-theme / data-glass / data-reveal，服务端渲染时不可能
    // 知道这些值（它们来自 localStorage 与媒体查询），React 必然对不上。
    // 这个属性只影响 <html> 这一层，不会掩盖子树里的真实 hydration 问题。
    <html
      lang="zh-Hans"
      data-scroll-behavior="smooth"
      className={`${displayFont.variable} ${quoteFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* 首帧前应用已保存的主题与透明度偏好，避免闪烁。必须同步执行。 */}
        <script dangerouslySetInnerHTML={{ __html: displayPrefsScript }} />
      </head>
      <body className="min-h-dvh">
        <a className="skip-link" href="#main">
          跳转到主要内容
        </a>
        <PaperFilters />
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <RevealObserver />
      </body>
    </html>
  );
}
