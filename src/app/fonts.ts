import localFont from "next/font/local";

/**
 * 展示级标题字体：Noto Sans SC 700 子集（SIL OFL 1.1，允许子集化与 webfont 分发）。
 * 由 scripts/subset-fonts.mjs 在 prebuild 阶段生成，只含站内实际用字 + 高频兜底。
 *
 * 正文不加载 web 字体 —— 走系统字体栈（见 globals.css 的 --font-sans）。
 */
export const displayFont = localFont({
  src: [
    {
      path: "./fonts/NotoSansSC-title-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-yy-display",
  display: "swap",
  preload: true,
  // adjustFontFallback 只提供 Arial / Times New Roman，对中文字面度量毫无参考
  // 价值，用了反而引入错误的 size-adjust 让 CLS 变差。
  adjustFontFallback: false,
  fallback: ["PingFang SC", "Microsoft YaHei", "sans-serif"],
});

/**
 * 引文字体：霞鹜文楷 Medium 子集（SIL OFL 1.1）
 *
 * 基于手写楷书，有笔锋、有温度，与首屏的手绘油画同源 —— 这是刻意的配对，
 * 不是「中文站默认上思源黑体」那种无选择的选择。
 *
 * 但必须克制：只用于古语题引与理事长致辞，绝不用于正文（楷体小字号可读性
 * 明显差于黑体，长文会很累）。字符集也因此只覆盖 content/quotes.ts，
 * 61.8KB 就够了。
 *
 * preload: false —— 它只服务首屏一行题引，不值得跟主标题抢带宽。
 * 楷体到达前先用黑体渲染，字体切换会有一次轻微的重排，但只影响一行短文本。
 */
export const quoteFont = localFont({
  src: [
    {
      path: "./fonts/LXGWWenKai-quote.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-yy-quote",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Kaiti SC", "STKaiti", "KaiTi", "serif"],
});
