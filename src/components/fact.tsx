import { TODO, isPlaceholder, isDraft, isSlot, textOf, type Slot } from "@content/site";
import { cn } from "@/lib/cn";

const isDev = process.env.NODE_ENV !== "production";

/** 演示模式：把待填槽渲染成示意内容，让视觉方案能被评估。仅 `pnpm dev:demo` */
const isDemo = process.env.NEXT_PUBLIC_DEMO === "1";

/**
 * 内容渲染器
 * ---------------------------------------------------------------------------
 * 把三类内容在类型与视觉上彻底分开：
 *
 *   TODO_FOUNDATION_INPUT  事实性内容，只能由基金会提供。渲染成醒目的待填
 *                          标记，生产构建由 check-placeholders.mjs 拦截。
 *   DRAFT                  我起草的表述性文案。正常显示，开发环境下加一道
 *                          淡虚线便于逐条审阅，生产环境完全无痕。
 *   其它                   已确认的正式内容，原样输出。
 *
 * 之所以做到这个程度：在慈善机构官网上编造数字、资质或合作方，触及的是
 * 《慈善法》第 111 条的虚假宣传，最重可吊销登记证书并五年内不得重新申请
 * 公开募捐资格 —— 这和普通商业站放一段示例文案完全不是一回事。
 */
export function Fact({
  value,
  className,
  fallback,
}: {
  value: string | Slot;
  className?: string;
  /** 占位未填时的中性替代文案（用于不适合露出待填标记的位置，如 meta 标签） */
  fallback?: string;
}) {
  if (isSlot(value)) {
    if (isDemo) {
      return (
        <span
          className={className}
          title="演示内容，非基金会真实数据"
        >
          {value.demo}
        </span>
      );
    }
    return <Fact value={value.todo} className={className} fallback={fallback} />;
  }

  if (isDraft(value)) {
    return (
      <span
        className={cn(
          className,
          isDev &&
            "decoration-amber-400/70 decoration-dashed underline-offset-[6px] hover:underline",
        )}
        title={isDev ? "起草文案，待基金会审阅（不阻塞上线）" : undefined}
      >
        {textOf(value)}
      </span>
    );
  }

  if (!isPlaceholder(value)) {
    return <span className={className}>{value}</span>;
  }

  if (fallback !== undefined) {
    return <span className={className}>{fallback}</span>;
  }

  const label = value.slice(TODO.length + 1) || "待基金会提供";

  // 演示模式下不用刺眼的黄块 —— 那是给内容负责人看的工作标记，
  // 会淹没视觉方案本身。改成低调的灰色提示，版式不受干扰。
  if (isDemo) {
    return (
      <span className={cn(className, "text-fg-subtle")}>
        （{label.split("（")[0]}）
      </span>
    );
  }

  return (
    <mark
      className="inline-flex items-baseline gap-1 rounded-sm bg-amber-100 px-1.5 py-0.5 text-caption font-medium text-amber-950 ring-1 ring-amber-300 ring-inset dark:bg-amber-950 dark:text-amber-100 dark:ring-amber-800"
      title="此处需要基金会提供真实信息后替换，未替换不允许上线"
    >
      <span className="sr-only">待填内容：</span>
      {label}
    </mark>
  );
}

/** 整块待填内容的占位（用于段落、卡片、列表这类需要成段提供的内容） */
export function FactBlock({
  label,
  hint,
  className,
}: {
  label: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-amber-400 bg-amber-50/70 p-5 dark:border-amber-800 dark:bg-amber-950/40",
        className,
      )}
    >
      <p className="flex items-center gap-2 text-caption font-semibold tracking-wide text-amber-900 dark:text-amber-200">
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 fill-current">
          <path d="M8 1.5a1 1 0 0 1 .87.5l6 10.5A1 1 0 0 1 14 14H2a1 1 0 0 1-.87-1.5l6-10.5A1 1 0 0 1 8 1.5Zm0 3.75a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0V6a.75.75 0 0 0-.75-.75ZM8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
        </svg>
        待基金会提供 · {label}
      </p>
      {hint ? (
        <p className="mt-2 text-body text-amber-900/90 dark:text-amber-100/80">{hint}</p>
      ) : null}
    </div>
  );
}

/**
 * 开发环境的内容状态提示条。生产构建不渲染。
 */
export function DraftBanner() {
  if (!isDev) return null;
  return (
    <div className="border-b border-amber-300 bg-amber-100 px-6 py-2 text-center text-caption text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
      内容占位阶段 ·
      <span className="mx-1 font-medium">黄色标记</span>处需要基金会提供真实信息，
      <span className="mx-1 font-medium">虚线</span>处为待审阅的起草文案 · 清单见
      <code className="mx-1">docs/CONTENT-CHECKLIST.md</code>
    </div>
  );
}
