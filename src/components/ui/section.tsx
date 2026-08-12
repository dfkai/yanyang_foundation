import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { TornEdge } from "../paper-filters";

/** 统一版心。--container-content = 68rem，正文块另有 --container-prose = 40rem。 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-(--container-content) px-6 sm:px-8", className)}>
      {children}
    </div>
  );
}

/** 区块：控制垂直节奏。中文长内容需要比英文站更大的呼吸空间。 */
export function Section({
  className,
  children,
  id,
  tone = "default",
  labelledBy,
  tornTop = false,
  tornFlip = false,
}: {
  className?: string;
  children: ReactNode;
  id?: string;
  tone?: "default" | "subtle" | "surface" | "warm" | "dark";
  labelledBy?: string;
  /** 上边缘用撕纸边而不是一条直线，把本区块的底色「撕」进上一个区块 */
  tornTop?: boolean;
  /** 相邻两处翻转一下，避免重复同一条边缘 */
  tornFlip?: boolean;
}) {
  const tones = {
    default: "",
    subtle: "bg-bg-subtle",
    surface: "bg-surface",
    // 饱和暖色块：整站的节奏靠饱和度起伏而不是明暗交替，
    // 这样既有对比，又不会出现「一个叫艳阳的基金会首页是黑的」这种事
    warm: "surface-warm",
    // 深色只留给结尾一处，作为收束的锚点
    dark: "surface-dark",
  } as const;

  const toneText = {
    default: "text-bg",
    subtle: "text-bg-subtle",
    surface: "text-surface",
    warm: "text-transparent",
    dark: "text-transparent",
  } as const;

  const body = (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("py-20 sm:py-28", tones[tone], className)}
    >
      <Container>{children}</Container>
    </section>
  );

  if (!tornTop) return body;

  // 撕纸边用 currentColor 取本区块的底色，视觉上是把这一块的纸
  // 撕进上一个区块里，而不是两块之间划一条线
  return (
    <div className="relative">
      <TornEdge
        flip={tornFlip}
        className={cn("-mb-px", toneText[tone])}
      />
      {body}
    </div>
  );
}

/**
 * 区块小标题（栏目名）
 * ---------------------------------------------------------------------------
 * 上一版这里是「3px 笔刷 + 圆点 + 橙色粗体 + 0.08em 字距」，四件装饰叠在一个
 * 五字标签上。栏目名的职责只是标记位置，它不该比标题还响。
 *
 * 现在只剩两样：一条 1px 短线 + 一行中性色小字。线用 currentColor 的半透明，
 * 跟着文字走，不必单独配色，换到任何底色上都自洽。
 */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-[0.8125rem] font-medium tracking-[0.04em] text-fg-muted">
      <span aria-hidden="true" className="h-px w-5 bg-current opacity-40" />
      {children}
    </p>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("max-w-(--container-prose)", className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 id={id} className="mt-4 text-h2 text-fg sm:text-h1">
        {title}
      </h2>
      {lead ? <div className="mt-5 text-lead text-fg-muted">{lead}</div> : null}
    </header>
  );
}
