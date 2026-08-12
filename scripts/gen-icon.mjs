#!/usr/bin/env node
/**
 * 生成 favicon
 * ---------------------------------------------------------------------------
 * 站内标识（components/brand-mark.tsx）有 8 道光芒，在浏览器标签页的 16px 上
 * 会并成一圈毛刺。所以 favicon 单出一版：光芒减到 4 道并大幅加粗，日轮相应
 * 放大占满画布。很多品牌都这么做 —— 图标在极小尺寸下本就该是另一套线稿，
 * 而不是同一张图缩小。
 *
 * 手绘轮廓的算法和 lib/hand-drawn.ts 一致（这里内联一份，因为构建脚本跑在
 * Node 里，不经过 TS 编译）。改动标识造型后重跑 `pnpm icon:build`。
 */
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();

const rand = (i, seed = 1) => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const jitter = (i, seed = 1) => rand(i, seed) * 2 - 1;

function smoothClosed(pts) {
  const n = pts.length;
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d + "Z";
}

function wobblyCircle(cx, cy, r, { points = 11, amp = 0.05, seed = 1 } = {}) {
  const pts = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2 + jitter(i, seed + 7) * 0.05;
    const rr = r * (1 + jitter(i, seed) * amp);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return smoothClosed(pts);
}

function ray(cx, cy, angle, inner, outer, halfWidth, seed) {
  const bow = jitter(seed, 3) * 0.055;
  const p = (r, da) => [cx + Math.cos(angle + da) * r, cy + Math.sin(angle + da) * r];
  const mid = (inner + outer) / 2;
  return smoothClosed([
    p(inner, -halfWidth),
    p(mid, -halfWidth * 0.82 + bow),
    p(outer, -halfWidth * 0.34),
    p(outer + (outer - inner) * 0.04, 0),
    p(outer, halfWidth * 0.34),
    p(mid, halfWidth * 0.82 + bow),
    p(inner, halfWidth),
  ]);
}

const CX = 16;
const CY = 16;

// 4 道光芒，比站内标识粗得多：16px 下细光芒会直接消失
const RAYS = Array.from({ length: 4 }, (_, i) => {
  const angle = (i / 4) * Math.PI * 2 + Math.PI / 4 + jitter(i, 3) * 0.06;
  const inner = 9.6;
  const outer = 14.6 + rand(i, 7) * 0.8;
  return ray(CX, CY, angle, inner, outer, 0.3, i);
});

// 日轮放大到几乎占满：小尺寸下实心块面比细节可靠得多
const DISC = wobblyCircle(CX, CY, 9.1, { points: 11, amp: 0.04, seed: 21 });
const CORE = wobblyCircle(CX - 0.8, CY - 0.7, 5.6, { points: 9, amp: 0.06, seed: 43 });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <title>艳阳基金会</title>
${RAYS.map((d) => `  <path d="${d}" fill="#f2a13c"/>`).join("\n")}
  <path d="${DISC}" fill="#e8811e"/>
  <path d="${CORE}" fill="#fbc748"/>
</svg>
`;

await writeFile(join(ROOT, "src/app/icon.svg"), svg);
console.log(`· src/app/icon.svg  ${(svg.length / 1024).toFixed(2)} KB`);
