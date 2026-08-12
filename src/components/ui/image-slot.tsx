import { cn } from "@/lib/cn";
import { SceneArt, type SceneKind } from "./scene-art";

const isDemo = process.env.NEXT_PUBLIC_DEMO === "1";

/**
 * 影像位
 * ---------------------------------------------------------------------------
 * 站内所有等待基金会提供照片的位置都用这个，而不是各页各写一份。
 *
 * 它刻意做成「一个明确的空位」而不是灰色占位图或图库摆拍：
 *
 *   · 灰色方块看不出这里要什么，基金会拿到也不知道该交什么
 *   · 图库摆拍会一路留到上线（没人记得换），而摆拍的「乡村儿童」照片
 *     对公益机构的伤害不亚于造假
 *   · AI 生成的人物影像更不能用 —— 一旦被识破，公信力是不可逆的
 *
 * 所以这里写清楚三件事：要什么内容、什么规格、授权怎么办。
 */
export function ImageSlot({
  label,
  hint,
  ratio = "16/9",
  art,
  className,
}: {
  label: string;
  hint?: string;
  ratio?: string;
  /** 演示模式下用哪张插画填充 */
  art?: SceneKind;
  className?: string;
}) {
  // 演示模式：画插图撑住版式。插画是明示的图形，不会被误认为项目记录 ——
  // 这跟填一张图库照片或 AI 生成的人物影像是两回事。
  if (isDemo && art) {
    return (
      <figure
        className={cn("relative overflow-hidden rounded-2xl", className)}
        style={{ aspectRatio: ratio }}
      >
        <SceneArt kind={art} />
        <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/45 to-transparent px-4 py-3 text-caption text-white/90">
          示意插画 · 实际应为真实现场照片
        </figcaption>
      </figure>
    );
  }

  return (
    <figure
      className={cn(
        "lit-corner relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-dashed border-border-strong bg-surface p-8 text-center",
        className,
      )}
      style={{ aspectRatio: ratio }}
    >
      {/* 一点暖光，让空位也在这套视觉语言里，不像个报错框 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(125% 95% at 80% 10%, var(--accent-soft) 0%, transparent 62%)",
        }}
      />
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="crayon relative size-9 text-fg-subtle"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10" r="1.5" />
        <path d="m3 16 4.5-4 3.5 3 4-5 6 6" />
      </svg>
      <figcaption className="relative">
        <p className="text-body font-medium text-fg">{label}</p>
        {hint ? (
          <p className="mx-auto mt-2 max-w-sm text-caption text-fg-muted">{hint}</p>
        ) : null}
        <p className="mx-auto mt-3 max-w-sm text-caption text-fg-subtle">
          本站不使用图库摆拍或 AI 生成的人物影像。涉及人物的照片需附当事人书面公开授权；
          未成年人另需监护人同意。
        </p>
      </figcaption>
    </figure>
  );
}
