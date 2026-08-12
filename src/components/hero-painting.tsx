import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { jitter, rand, smoothOpen, wobblyBand, wobblyCircle } from "@/lib/hand-drawn";

/**
 * 首屏画布
 * ---------------------------------------------------------------------------
 * 浅色主题走向日葵 / 麦田（暖米白画布上的铬黄与镉橙），深色主题走星月夜
 * （深靛蓝上的漩涡与亮黄）。两套各有出处，不是简单反色。
 *
 * 全部零滤镜。手绘感来自 lib/hand-drawn 算出来的不规则路径 —— 早先这里用
 * feTurbulence + feDisplacementMap 去扭规整形状，视觉接近，但滤镜结果虽然
 * 静态，浏览器却在滚动时反复光栅化整幅画布，实测帧率 64 → 52、最差帧 82ms。
 * 换成算路径后零运行时开销，而且是纯矢量，任何屏幕密度下都清晰。
 *
 * 太阳不在这里 —— 它在 HeroSun 里单独成层，那样才能做入场旋转与滚动微旋。
 *
 * 纯 SVG/CSS，零图片请求，是 Server Component。
 */

const W = 1440;
const H = 900;

/** 天空的一道色带 + 地面的两道，边缘全是手画的起伏 */
const SKY_BAND = wobblyBand(W, 96, 148, -90, { segments: 8, amp: 30, seed: 5 });
const GROUND_FAR = wobblyBand(W, 648, 604, H + 90, { segments: 9, amp: 26, seed: 12 });
const GROUND_NEAR = wobblyBand(W, 784, 752, H + 90, { segments: 10, amp: 22, seed: 29 });

/** 星月夜的漩涡：极坐标螺旋，半径带低频扰动 */
function swirl(cx: number, cy: number, r0: number, turns: number, seed: number) {
  const steps = Math.round(turns * 42);
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * turns * Math.PI * 2;
    const r = r0 + t * 158 + Math.sin(a * 2 + seed) * 7;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.74]);
  }
  return smoothOpen(pts);
}

const SWIRLS = [
  { d: swirl(430, 250, 26, 2.6, 1), w: 13 },
  { d: swirl(860, 150, 20, 2.2, 5), w: 10 },
  { d: swirl(180, 470, 17, 1.9, 9), w: 9 },
];

/** 散落的笔触点：深色下读作星子，浅色下读作飘絮 */
const FLECKS = Array.from({ length: 22 }, (_, i) =>
  wobblyCircle(
    60 + rand(i, 2) * (W - 120),
    120 + rand(i, 6) * 700,
    3.5 + rand(i, 8) * 6,
    { points: 7, amp: 0.24, seed: i + 100 },
  ),
);

/** 地面上几道更浓的笔触，叠出颜料的层次 */
const STROKES = Array.from({ length: 7 }, (_, i) => {
  const y = 690 + rand(i, 31) * 170;
  const x = -60 + rand(i, 37) * (W + 40);
  const len = 130 + rand(i, 41) * 260;
  const pts: [number, number][] = Array.from({ length: 5 }, (_, k) => [
    x + (len / 4) * k,
    y + jitter(i * 5 + k, 47) * 9,
  ]);
  return { d: smoothOpen(pts), w: 7 + rand(i, 53) * 9 };
});

export function HeroPainting({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <svg
        className="absolute inset-0 size-full"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        {/* 画布底 */}
        <rect x={-40} y={-40} width={W + 80} height={H + 80} className="fill-(--paint-sky)" />
        {/* 天空上沿的一道色带 */}
        <path d={SKY_BAND} className="fill-(--paint-sky-2)" />

        {/* 漩涡：只在深色主题显形（浅色下透明度为 0） */}
        <g fill="none" strokeLinecap="round" className="opacity-(--paint-swirl-opacity)">
          {SWIRLS.map((s, i) => (
            <path key={i} d={s.d} strokeWidth={s.w} className="stroke-(--paint-swirl)" />
          ))}
        </g>

        {/* 地面两道：远处一道、近处一道，色层叠出深度 */}
        <path d={GROUND_FAR} className="fill-(--paint-ground)" />
        <path d={GROUND_NEAR} className="fill-(--paint-ground-2)" />

        {/* 地面上的笔触：厚涂的层次靠色层叠加，不靠 feDiffuseLighting */}
        <g
          fill="none"
          strokeLinecap="round"
          className="stroke-(--paint-ground) opacity-40"
        >
          {STROKES.map((s, i) => (
            <path key={i} d={s.d} strokeWidth={s.w} />
          ))}
        </g>

        {/* 散落的笔触点 */}
        <g className="opacity-(--paint-fleck-opacity)">
          {FLECKS.map((d, i) => (
            <path key={i} d={d} className="fill-(--paint-fleck)" />
          ))}
        </g>
      </svg>

      {/* 纸纹：静态位图纹理，不是滤镜，开销可以忽略 */}
      <div
        className="absolute inset-0 opacity-(--paint-grain-opacity) mix-blend-multiply"
        style={
          {
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.62' numOctaves='4'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23p)'/%3E%3C/svg%3E\")",
          } as CSSProperties
        }
      />

      {/* 底部把画收进页面底色，与内容区衔接而不是硬切 */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }}
      />
    </div>
  );
}
