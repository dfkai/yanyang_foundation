#!/usr/bin/env node
/**
 * 上线守卫：拦截未替换的占位内容
 * ---------------------------------------------------------------------------
 * 只在生产构建时生效（CHECK_PLACEHOLDERS=1，由 package.json 的 build 脚本设置），
 * 本地 dev 与预览构建不受影响。
 *
 * 为什么值得为此加一道构建门禁：《慈善法》第 111 条规定，以虚假宣传、虚构
 * 事实等方式欺骗、诱导募捐对象的，可责令停止募捐、退还财产，情节严重的吊销
 * 登记证书，且被吊销公开募捐资格证书的五年内不得再次申请。也就是说，一个
 * 没删干净的示例数字在慈善机构官网上不是「小瑕疵」，是行政违法风险。
 *
 * DRAFT 前缀的起草文案不在拦截范围 —— 那是表述性文字，不构成事实声明。
 */
import { readdir, readFile } from "node:fs/promises";
import { join, extname, relative } from "node:path";

const ROOT = process.cwd();
const MARKER = "TODO_FOUNDATION_INPUT";
const SCAN_DIRS = ["src", "content"];
const EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".md", ".mdx", ".json"]);

/**
 * 跳过「提到这个标记」而非「使用这个标记」的行 —— 注释与常量定义本身。
 * 不能整文件排除：content/site.ts 里放的正是统一社会信用代码、登记管理机关
 * 这类最关键的事实性内容，恰恰最需要被守卫覆盖。
 */
function isMentionOnly(line) {
  const t = line.trim();
  if (t.startsWith("*") || t.startsWith("//") || t.startsWith("/*")) return true;
  // export const TODO = "TODO_FOUNDATION_INPUT"
  if (/^export\s+const\s+TODO\s*=/.test(t)) return true;
  if (/^export\s+const\s+slot\s*=/.test(t)) return true;
  if (/^import\s/.test(t)) return true;
  // const MARKER = "TODO_FOUNDATION_INPUT"（本脚本自身）
  if (/^const\s+MARKER\s*=/.test(t)) return true;
  return false;
}

async function walk(dir, out = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else if (EXT.has(extname(e.name))) out.push(p);
  }
  return out;
}

const files = (await Promise.all(SCAN_DIRS.map((d) => walk(join(ROOT, d))))).flat();
const hits = [];

for (const file of files) {
  const rel = relative(ROOT, file);
  const text = await readFile(file, "utf8");
  if (!text.includes(MARKER) && !/\bslot\s*\(/.test(text)) continue;
  text.split("\n").forEach((line, i) => {
    if (isMentionOnly(line)) return;
    // slot("...", "...") 在源码里不留 MARKER 字面量，要单独数
    const slotCalls = (line.match(/\bslot\s*\(/g) || []).length;
    if (line.includes(MARKER) || slotCalls > 0) {
      hits.push({ rel, line: i + 1, text: line.trim().slice(0, 100) });
    }
  });
}

if (hits.length === 0) {
  console.log("✓ 无未替换的占位内容");
  process.exit(0);
}

const strict = process.env.CHECK_PLACEHOLDERS === "1";
const head = `${strict ? "✗ 构建终止" : "· 提示"}：发现 ${hits.length} 处未由基金会确认的事实性内容`;
console[strict ? "error" : "log"](head);
for (const h of hits) {
  console[strict ? "error" : "log"](`    ${h.rel}:${h.line}  ${h.text}`);
}

if (strict) {
  console.error(
    "\n  这些位置需要基金会提供真实信息后才能上线。清单见 docs/CONTENT-CHECKLIST.md。" +
      "\n  如需在内容齐备前做一次预览部署，用 pnpm build:preview。",
  );
  process.exit(1);
}
