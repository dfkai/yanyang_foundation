import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * 标签
 * ---------------------------------------------------------------------------
 * 优雅来自克制，不来自装饰。这里的每个数值都是抠过的：
 *
 *   · 圆角 6px 而不是全圆 —— 胶囊形状在小标签上显得廉价，方向感也弱
 *   · 字号 12px + 字重 500 + 字距 0.02em —— 小字必须略微加重、放宽才立得住
 *   · 内边距 10/3 px，视觉上左右比上下宽一倍，这是小标签唯一舒服的比例
 *   · 边框用 currentColor 的极低透明度，而不是另取一个灰 —— 这样标签在
 *     任何底色上都自洽，不需要为每个场景各配一套边框色
 *
 * 三个变体够用：默认（中性）、accent（品牌，克制使用）、outline（最弱）。
 */
type Variant = "default" | "accent" | "outline";

const variants: Record<Variant, string> = {
  default:
    "bg-fg/[0.045] text-fg-muted ring-1 ring-fg/[0.08] ring-inset",
  accent:
    "bg-accent/[0.09] text-accent ring-1 ring-accent/20 ring-inset",
  outline: "text-fg-subtle ring-1 ring-fg/[0.12] ring-inset",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-[3px] text-[0.75rem] leading-[1.5] font-medium tracking-[0.02em] whitespace-nowrap",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
