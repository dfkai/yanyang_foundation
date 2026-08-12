import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "onGlass";
type Size = "md" | "lg";

/**
 * 按钮
 * ---------------------------------------------------------------------------
 * 圆角统一用 capsule（半径 = 高度的 50%）—— 这是最能一眼读出「当代 Apple
 * 语言」的单一信号，而且完全不依赖玻璃效果。
 *
 * 配色是实算过的：品牌橙 500 上放白字只有 2.90:1，远不达 WCAG AA，
 * 所以实体按钮用 brand-700（白字 5.83:1）。品牌橙留给图形与光晕。
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-[background-color,color,box-shadow,transform] duration-(--duration-base) " +
  "ease-(--ease-out-soft) active:scale-[0.98] " +
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring)";

const variants: Record<Variant, string> = {
  // 一块颜料：日光渐变 + 受光内唇 + 暖色投影，呼应首屏的手绘油画
  primary: "btn-paint",
  // 画布纸白 + 暖描边，与主按钮同源但退后一层
  secondary: "btn-paper",
  ghost: "text-fg-muted hover:bg-bg-subtle hover:text-fg",
  // 玻璃/照片背景之上：自带足够的底色，不依赖背景对比
  onGlass:
    "bg-white/92 text-sand-900 shadow-warm-md hover:bg-white " +
    "focus-visible:outline-white",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-body",
  lg: "h-13 px-7 text-body-lg",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: BaseProps & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: BaseProps & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}
