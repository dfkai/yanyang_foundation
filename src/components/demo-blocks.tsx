import type { Block } from "@content/demo-pages";
import { HandRule } from "./ui/hand-rule";
import { Badge } from "./ui/badge";

/**
 * 示意内容渲染器
 * ---------------------------------------------------------------------------
 * 只在演示模式下被调用（PageShell 里判断）。六种内容块覆盖了这个站会出现的
 * 全部信息形态：段落、键值对、卡片、清单、时间线、数据。
 *
 * 每种块的排版都跟着首页那套走 —— 手绘分隔线、shadcn 式标签、实色卡片，
 * 这样内页和首页不会是两个网站。
 */
export function DemoBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="grid gap-12">
      {blocks.map((b, i) => (
        <DemoBlock key={i} block={b} />
      ))}
    </div>
  );
}

function DemoBlock({ block }: { block: Block }) {
  switch (block.t) {
    case "prose":
      return (
        <div className="prose-zh text-body-lg whitespace-pre-line">{block.body}</div>
      );

    case "meta":
      return (
        <dl className="grid gap-x-10 gap-y-0 sm:grid-cols-2">
          {block.rows.map(([k, v], i) => (
            <div key={i} className="py-4">
              <dt className="text-caption text-fg-subtle">{k}</dt>
              <dd className="mt-1 text-body text-fg">{v}</dd>
              <HandRule variant={i} className="mt-4 opacity-70" />
            </div>
          ))}
        </dl>
      );

    case "cards":
      return (
        <ul className="grid gap-5 md:grid-cols-2">
          {block.items.map((it, i) => (
            <li key={i} className="lit-corner paper-edge rounded-2xl bg-surface p-7">
              {it.meta ? (
                <Badge variant="accent" className="mb-3">
                  {it.meta}
                </Badge>
              ) : null}
              <h3 className="text-h4 text-fg">{it.title}</h3>
              <p className="mt-2.5 text-body text-fg-muted">{it.body}</p>
            </li>
          ))}
        </ul>
      );

    case "list":
      return (
        <ul>
          {block.items.map((it, i) => (
            <li key={i}>
              {i === 0 ? <HandRule variant={2} /> : null}
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5">
                <span className="text-body-lg font-medium text-fg">{it.title}</span>
                <span className="flex items-center gap-3">
                  {it.note ? <Badge variant="outline">{it.note}</Badge> : null}
                  <span className="text-caption text-fg-subtle tabular-nums">{it.meta}</span>
                </span>
              </div>
              <HandRule variant={i} />
            </li>
          ))}
        </ul>
      );

    case "timeline":
      return (
        <ol className="grid gap-0">
          {block.items.map((it, i) => (
            <li key={i} className="grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[5rem_1fr]">
              <span className="text-body font-semibold text-accent tabular-nums">
                {it.year}
              </span>
              <div>
                <h3 className="text-h4 text-fg">{it.title}</h3>
                <p className="mt-1.5 text-body text-fg-muted">{it.body}</p>
              </div>
              {i < block.items.length - 1 ? (
                <HandRule variant={i} className="sm:col-span-2" />
              ) : null}
            </li>
          ))}
        </ol>
      );

    case "stats":
      return (
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl lg:grid-cols-4">
          {block.items.map((s, i) => (
            <div key={i} className="paper-edge rounded-2xl bg-surface px-6 py-7">
              <dd className="flex items-baseline gap-1">
                <span className="sun-text text-[clamp(1.625rem,3vw,2.25rem)] leading-none font-bold tracking-[-0.02em] tabular-nums">
                  {s.value}
                </span>
                <span className="text-body font-medium text-accent">{s.unit}</span>
              </dd>
              <dt className="mt-2.5 text-caption text-fg-muted">{s.label}</dt>
            </div>
          ))}
        </dl>
      );
  }
}
