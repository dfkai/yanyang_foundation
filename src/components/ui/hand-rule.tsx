import { cn } from "@/lib/cn";

/**
 * 手绘横线
 * ---------------------------------------------------------------------------
 * 替代 border-bottom 那条用尺子量出来的直线。首屏既然是画的，下面的分隔就
 * 不该是直的。
 *
 * 三条起伏不同的曲线轮流使用 —— 同一条重复十遍，反而暴露它是「假手绘」。
 * 曲线本身是预先设计好的贝塞尔，不是运行时随机生成：logo 那条原则在这里
 * 同样成立，手的温度来自笔形，不来自笔误，而且确定性的路径才能保证服务端
 * 与客户端渲染一致。
 *
 * preserveAspectRatio="none" 让它横向拉伸而纵向不变形，所以无论容器多宽，
 * 线条粗细都保持一致。
 */
const CURVES = [
  "M0,3.1 C 190,1.5 370,4.5 570,2.9 C 790,1.3 990,4.7 1200,2.5",
  "M0,2.5 C 210,4.5 390,1.3 610,3.3 C 830,4.9 1010,1.5 1200,3.1",
  "M0,3.5 C 170,2 350,4.9 550,3 C 770,1.3 970,4.3 1200,2.7",
];

export function HandRule({
  variant = 0,
  className,
  width = 1.3,
}: {
  variant?: number;
  className?: string;
  width?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 6"
      preserveAspectRatio="none"
      className={cn("block h-1.5 w-full text-border-strong", className)}
    >
      <path
        d={CURVES[variant % CURVES.length]}
        stroke="currentColor"
        strokeWidth={width}
        strokeLinecap="round"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
