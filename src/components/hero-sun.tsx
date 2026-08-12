"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { jitter, rand, ray, wobblyCircle } from "@/lib/hand-drawn";

/**
 * 首屏的太阳
 * ---------------------------------------------------------------------------
 * 手绘感来自**算出来的不规则路径**，不是滤镜。日轮是半径带扰动的闭合曲线，
 * 光芒是两侧微鼓、末端圆润的锥形笔触，长短粗细各不相同。
 *
 * 之前这里用 feTurbulence + feDisplacementMap 去扭一个正圆，视觉接近但
 * 滚动时浏览器要反复光栅化滤镜，帧率掉到 52。现在零滤镜。
 *
 * 单独成层是为了能动：入场时从偏小、逆时针偏转转正放大（日出），
 * 之后随滚动极缓慢继续旋转 —— 是氛围，不是特效。
 */

const CX = 350;
const CY = 350;

/** 光芒：15 道，角度、长度、宽度都不齐 —— 齐了就变成齿轮 */
const RAYS = Array.from({ length: 15 }, (_, i) => {
  const angle = (i / 15) * Math.PI * 2 + jitter(i, 3) * 0.09;
  const inner = 148 + rand(i, 5) * 16;
  const outer = inner + 74 + rand(i, 7) * 116;
  const half = 0.032 + rand(i, 11) * 0.05;
  return ray(CX, CY, angle, inner, outer, half, i);
});

/** 日轮：外圈与内芯各自扰动，两层轮廓不重合才有「颜料叠上去」的厚度 */
const DISC_OUTER = wobblyCircle(CX, CY, 146, { points: 14, amp: 0.055, seed: 21 });
const DISC_CORE = wobblyCircle(CX - 14, CY - 12, 97, { points: 12, amp: 0.07, seed: 43 });
/** 内芯上再叠一小片高光，模拟颜料最厚处的受光面 */
const DISC_LIGHT = wobblyCircle(CX - 34, CY - 34, 52, { points: 10, amp: 0.1, seed: 67 });

export function HeroSun({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scrollRotate = useTransform(scrollYProgress, [0, 1], [0, 12]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute", className)}
    >
      <motion.svg
        viewBox="0 0 700 700"
        className="size-full"
        style={reduce ? undefined : { rotate: scrollRotate }}
        initial={reduce ? false : { scale: 0.74, rotate: -24, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      >
        <g className="opacity-90">
          {RAYS.map((d, i) => (
            <path key={i} d={d} className="fill-(--paint-ray)" />
          ))}
        </g>
        <path d={DISC_OUTER} className="fill-(--paint-sun-outer)" />
        <path d={DISC_CORE} className="fill-(--paint-sun-core)" />
        <path d={DISC_LIGHT} className="fill-(--paint-sun-core)" opacity="0.55" />
      </motion.svg>
    </div>
  );
}
