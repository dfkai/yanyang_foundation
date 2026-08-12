#!/usr/bin/env node
/**
 * 中文字体子集化
 * ---------------------------------------------------------------------------
 * 策略（见 docs/RESEARCH.md「字体」一节）：
 *   正文  → 系统字体栈（苹方 / 微软雅黑 / 思源黑体），0 字节，不加载 web 字体。
 *   标题  → Noto Sans SC 700，只子集站内实际用到的字 + 高频兜底，约 100–150KB。
 *
 * 之所以不给正文也自托管中文字体：一份 top2500 的静态字重约 420KB，直接压在
 * LCP 上，而中文系统字体与思源黑体字形极为接近，这份体积换不来可感知的提升。
 *
 * 与 Turbopack 完全解耦 —— 走 npm script 而非 bundler 插件（Next 16 默认
 * Turbopack 会忽略 next.config 里的 webpack 字段，所有 xx-plugin-font 的
 * webpack 接入方式在 Next 16 上都是坏的）。
 *
 * 用法：pnpm font:build      （已挂在 prebuild 上，pnpm build 会自动跑）
 */
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { readdir } from "node:fs/promises";
import { join, extname } from "node:path";
import subsetFont from "subset-font";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "src/app/fonts");
const CHARSET_TOP = join(ROOT, "assets/charset-top2500.txt");

/**
 * 两个角色，两种字体 —— 这是刻意的配对，不是默认解。
 *
 *   标题  Noto Sans SC 700    黑体，撑得住大字号，给机构该有的分量
 *   引文  霞鹜文楷 Medium      基于手写楷书，有笔锋有温度，与手绘油画同源
 *
 * 楷体是「有性格的展示字体，克制使用」：只出现在古语题引、理事长致辞这些
 * 需要人味的地方，绝不用于正文——楷体小字号可读性差，长文会很累。
 * 也正因为用得少，它的字符集可以压得极小，不必带高频兜底。
 *
 * 正文完全不加载 web 字体，走系统字体栈（苹方 / 微软雅黑 / 思源黑体）。
 *
 * 两者均为 SIL OFL 1.1，明确允许子集化与 webfont 分发。
 */
const FONTS = [
  {
    file: "NotoSansSC-VF.ttf",
    url: "https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf",
    out: "NotoSansSC-title-700",
    wght: 700,
    // 高频兜底：标题文案以后会增改，掉字会变成豆腐块
    fallbackChars: 800,
  },
  {
    file: "LXGWWenKai-Medium.ttf",
    url: "https://github.com/lxgw/LxgwWenKai/releases/download/v1.522/LXGWWenKai-Medium.ttf",
    out: "LXGWWenKai-quote",
    // 静态字体，无可变轴
    wght: null,
    // 用量可控（古语 + 致辞），不加兜底，并且只扫引文文件本身 ——
    // 楷体笔画复杂，同字数体积约为黑体的 1.2 倍，喂全站字集会到 256KB
    fallbackChars: 0,
    scanOnly: ["content/quotes.ts"],
  },
];

/** 扫描这些目录里的实际用字 */
const SCAN_DIRS = ["src", "content"];
const SCAN_EXT = new Set([".tsx", ".ts", ".jsx", ".js", ".mdx", ".md", ".json"]);

const ASCII = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join("");
const PUNCT = "，。、；：？！（）《》〈〉【】〔〕「」『』—…·～％＆＠＃￥“”‘’　－／＋＝×÷°①②③④⑤⑥⑦⑧⑨⑩";

async function ensureSourceFont(font) {
  const path = join(ROOT, "assets/fonts", font.file);
  try {
    await stat(path);
    return path;
  } catch {
    console.log(`· 源字体 ${font.file} 不存在，下载中…`);
    const res = await fetch(font.url);
    if (!res.ok) throw new Error(`下载 ${font.file} 失败：HTTP ${res.status}`);
    await mkdir(join(ROOT, "assets/fonts"), { recursive: true });
    await writeFile(path, Buffer.from(await res.arrayBuffer()));
    console.log(`· ${font.file} 下载完成`);
  }
  return path;
}

async function walk(dir, out = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.name === "node_modules" || e.name === ".next" || e.name === "fonts") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else if (SCAN_EXT.has(extname(e.name))) out.push(p);
  }
  return out;
}

/** 站内实际出现的汉字 —— 这是子集的主体，精确且随内容自动增长 */
async function scanSiteChars(only) {
  const files = only
    ? only.map((f) => join(ROOT, f))
    : (await Promise.all(SCAN_DIRS.map((d) => walk(join(ROOT, d))))).flat();
  const chars = new Set();
  for (const f of files) {
    const text = await readFile(f, "utf8");
    for (const ch of text) {
      // \p{Script=Han} 覆盖汉字；标点与拉丁字符由下面的固定集合补齐
      if (/\p{Script=Han}/u.test(ch)) chars.add(ch);
    }
  }
  return { chars, fileCount: files.length };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const top = await readFile(CHARSET_TOP, "utf8");
  const all = await scanSiteChars();

  console.log(`· 扫描 ${all.fileCount} 个源文件，站内实际用字 ${all.chars.size} 个`);

  const manifest = [];
  for (const font of FONTS) {
    const srcPath = await ensureSourceFont(font);
    const source = await readFile(srcPath);

    const scoped = font.scanOnly ? await scanSiteChars(font.scanOnly) : all;

    // 实际用字 + 高频兜底（防止后续新增文案掉字变豆腐块）
    const set = new Set([
      ...scoped.chars,
      ...Array.from(top).slice(0, font.fallbackChars),
      ...ASCII,
      ...PUNCT,
    ]);
    const chars = [...set].join("");

    // variationAxes 传具体数值 = 把可变轴固定住 → 产出静态字重。
    // 实测一个 CJK 可变字体 ≈ 1.9 个静态字重，只要 1–2 个字重就不该上 VF。
    // 静态源字体（如霞鹜文楷）没有可变轴，传了会报错，所以按需附加。
    const buf = await subsetFont(source, chars, {
      targetFormat: "woff2",
      ...(font.wght ? { variationAxes: { wght: font.wght } } : {}),
    });
    const out = join(OUT_DIR, `${font.out}.woff2`);
    await writeFile(out, buf);
    const kb = (buf.length / 1024).toFixed(1);
    manifest.push({ name: font.out, chars: set.size, kb });
    console.log(`· ${font.out}.woff2  字形 ${set.size} 个  ${kb} KB`);
  }

  // 体积守卫：字体是这个项目 LCP 的头号风险，超预算要立刻知道
  const totalKb = manifest.reduce((s, m) => s + Number(m.kb), 0);
  console.log(`· 合计 ${totalKb.toFixed(1)} KB`);
  if (totalKb > 460) {
    console.error(`✗ 字体总体积 ${totalKb.toFixed(1)} KB 超出 460KB 预算，请收紧字集`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("✗ 字体子集化失败：", err);
  process.exit(1);
});
