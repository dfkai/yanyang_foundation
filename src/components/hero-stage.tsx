"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";

/**
 * 首屏动画编排
 * ---------------------------------------------------------------------------
 * 一个有顺序的进场，而不是满屏各自淡入的元素 —— 后者恰恰是「AI 生成感」的
 * 主要来源之一。顺序本身在叙事：
 *
 *   1. 画先展开（世界在那儿）
 *   2. 太阳升起来（光来了）
 *   3. 标题逐行落下（我们开口）
 *   4. 副标、按钮跟上
 *   5. 数据从底部推上来（拿出证据）
 *
 * 只有这几个包装器是客户端组件，页面主体仍是 Server Component。
 * 全部动画在 prefers-reduced-motion 下直接跳到终态，不是简单加速。
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/** 画布：缓慢展开，比文字先到位 */
export function StageCanvas({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // 滚动视差：画面下移得比页面慢，产生纵深
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // 只做 translateY，不做 scale。scale 会让矢量画布在每一帧重新光栅化，
  // 实测掉帧从 2 涨到 6；纯位移是合成器操作，不碰重绘。
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);

  if (reduce) {
    return (
      <div ref={ref} className="absolute inset-0">
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0"
      style={{ y, willChange: "transform" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.3, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** 文案容器：子元素依次落下 */
export function StageText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: reduce ? {} : { staggerChildren: 0.13, delayChildren: 0.45 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/** 单个文案元素。blur 从 10px 收到 0，比单纯位移更有「浮出来」的实感 */
export function StageItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={
        reduce
          ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
          : {
              hidden: { opacity: 0, y: 26, filter: "blur(10px)" },
              show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.85, ease: EASE },
              },
            }
      }
    >
      {children}
    </motion.div>
  );
}

/**
 * 标题行。用 span + block 而不是 div —— h1 里只允许放短语内容，
 * 塞 div 是无效 HTML，屏幕阅读器与解析器都可能出问题。
 */
export function StageLine({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      className={className}
      style={{ display: "block" }}
      variants={
        reduce
          ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
          : {
              hidden: { opacity: 0, y: 34, filter: "blur(12px)" },
              show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.9, ease: EASE },
              },
            }
      }
    >
      {children}
    </motion.span>
  );
}

/** 数据条：整体从底部推上来 */
export function StageStats({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE, delay: 1.05 }}
    >
      {children}
    </motion.div>
  );
}
