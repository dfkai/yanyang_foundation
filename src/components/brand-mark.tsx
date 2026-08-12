import { cn } from "@/lib/cn";
import { jitter, rand, ray, wobblyCircle } from "@/lib/hand-drawn";

/**
 * 机构标识
 * ---------------------------------------------------------------------------
 * 就是首屏那轮太阳的缩略版：同样的不规则日轮、同样两侧微鼓末端圆润的光芒，
 * 用的是同一套 lib/hand-drawn 函数。标识和主视觉共用一个母题，品牌语言才是
 * 一体的 —— 之前几版另起炉灶（地平线、双圆、光锥），都在和首屏打架。
 *
 * 缩略不是等比缩小，两处调整是为了小尺寸：
 *   · 光芒 15 道减到 8 道 —— 16px 下 15 道会糊成一圈毛刺
 *   · 光芒加粗约一倍 —— 原比例在 16px 下细到看不见
 *
 * 日轮内外两层轮廓刻意不重合，那是「颜料叠上去」的厚度，也是这套手绘语言
 * 最关键的一个细节。
 *
 * 16px 下可辨认。单色版把内芯去掉即可。
 */

const CX = 16;
const CY = 16;

/** 8 道光芒：角度不均分、长短不一 —— 齐了就变成齿轮 */
const RAYS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2 + jitter(i, 3) * 0.1;
  const inner = 8.2 + rand(i, 5) * 0.5;
  const outer = inner + 3.4 + rand(i, 7) * 3.2;
  const half = 0.15 + rand(i, 11) * 0.07;
  return ray(CX, CY, angle, inner, outer, half, i);
});

/** 日轮：外圈镉橙、内芯铬黄，两层轮廓不重合才有厚度 */
const DISC = wobblyCircle(CX, CY, 7.5, { points: 11, amp: 0.05, seed: 21 });
const CORE = wobblyCircle(CX - 0.7, CY - 0.6, 4.9, { points: 9, amp: 0.07, seed: 43 });

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-8 shrink-0", className)}
    >
      <g className="opacity-90">
        {RAYS.map((d, i) => (
          <path key={i} d={d} fill="oklch(0.845 0.155 76)" />
        ))}
      </g>
      <path d={DISC} fill="oklch(0.7 0.178 54)" />
      <path d={CORE} fill="oklch(0.858 0.162 88)" />
    </svg>
  );
}

export function BrandLockup({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <BrandMark />
      {/* nowrap 是必须的：窄视口下机构名会被断成「艳阳基 / 金会」 */}
      <span className="font-(family-name:--font-display) text-h4 font-bold tracking-[-0.01em] whitespace-nowrap text-fg">
        艳阳基金会
      </span>
    </span>
  );
}
