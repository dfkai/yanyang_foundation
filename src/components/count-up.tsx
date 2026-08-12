"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

/**
 * 数字滚动
 * ---------------------------------------------------------------------------
 * 进入视口时从 0 滚到目标值，只跑一次。对公益机构，这几个数字是页面上最硬的
 * 内容，值得一个明确的动作把视线钉在上面。
 *
 * 用 MotionValue 而不是 useState 驱动：MotionValue 直接写 DOM 文本节点，
 * 整个滚动过程一次 React 重渲染都不触发。用 state 的话这里每帧都要 setState，
 * 60fps 下就是每秒 60 次重渲染 —— React Compiler 的 lint 规则拦的正是这个。
 *
 * 三个必须处理的格式细节，否则滚完数字会变形：
 *   · 千分位（12,480）—— 解析时去掉，输出时补回
 *   · 小数位（98.2）—— 记住位数，否则滚完变成 98
 *   · 非数字值（占位标记、示意文本）—— 原样输出，不进动画
 */
export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();

  const numeric = Number(value.replace(/,/g, ""));
  const animatable = value.trim() !== "" && Number.isFinite(numeric);
  const decimals = value.includes(".") ? (value.split(".")[1]?.length ?? 0) : 0;
  const grouped = value.includes(",");

  const count = useMotionValue(0);
  const text = useTransform(count, (v) => format(v, decimals, grouped));

  useEffect(() => {
    if (!animatable) return;
    if (reduce) {
      count.set(numeric);
      return;
    }
    if (!inView) return;

    const controls = animate(count, numeric, {
      duration: 1.7,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, animatable, reduce, numeric, count]);

  if (!animatable) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}

function format(n: number, decimals: number, grouped: boolean) {
  const fixed = n.toFixed(decimals);
  if (!grouped) return fixed;
  const [int, frac] = fixed.split(".");
  const withSep = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return frac ? `${withSep}.${frac}` : withSep;
}
