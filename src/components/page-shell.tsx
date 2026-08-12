import Link from "next/link";
import { pages } from "@content/pages";
import { foundation, isPlaceholder, textOf } from "@content/site";
import { FactBlock } from "./fact";
import { Container, Section } from "./ui/section";
import { ImageSlot } from "./ui/image-slot";
import { DemoBlocks } from "./demo-blocks";
import { demoPages } from "@content/demo-pages";

const isDemo = process.env.NEXT_PUBLIC_DEMO === "1";

/**
 * 栏目页骨架
 * ---------------------------------------------------------------------------
 * 内容尚未到位时，页面要做的不是假装有内容，而是清楚说明这里需要什么。
 * 每个待填块都写明了对应的法规依据与格式要求，基金会照着填即可。
 *
 * 信息公开专区（disclosure: true）强制退出玻璃、使用实色高对比 —— 这类页面
 * 要的是严肃与可读，不是效果；Apple HIG 本身也禁止把玻璃用在内容层。
 */
export function PageShell({ path }: { path: string }) {
  const spec = pages[path];
  if (!spec) return null;
  // 演示模式下用示意内容替代待填块，让版式与信息密度可被评估
  const demo = isDemo ? demoPages[path] : undefined;

  return (
    <>
      <section className="relative border-b border-border bg-bg-subtle">
        <Container>
          <div className="py-16 sm:py-20">
            <nav aria-label="面包屑" className="mb-6">
              <Link
                href="/"
                className="text-caption text-fg-muted hover:text-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring)"
              >
                首页
              </Link>
              <span aria-hidden="true" className="mx-2 text-fg-subtle">
                /
              </span>
              <span className="text-caption text-fg">{spec.title}</span>
            </nav>
            <h1 className="text-h1 text-fg sm:text-display">{spec.title}</h1>
            <p className="mt-5 max-w-(--container-prose) text-lead text-fg-muted">
              {textOf(spec.lead)}
            </p>
          </div>
        </Container>
      </section>

      {spec.disclosure ? (
        <section data-section="disclosure">
          <Container>
            {/* 民政部令第 81 号第 3 条：慈善组织在其他渠道公布的信息，必须与
                国务院民政部门建立的统一平台上公布的一致。这句声明既满足一致性
                要求，也降低官网口径出错的风险。 */}
            <div className="solid-card mt-12 border-accent/25 bg-accent-soft p-6">
              <p className="text-body text-fg">
                本栏目信息与「慈善中国」全国慈善信息公开平台同步；如有不一致，以平台公示为准。
                {isPlaceholder(foundation.charityChinaUrl) ? null : (
                  <>
                    {" "}
                    <a
                      href={foundation.charityChinaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline underline-offset-4"
                    >
                      前往平台查验
                    </a>
                  </>
                )}
              </p>
            </div>
          </Container>
        </section>
      ) : null}

      <Section>
        {/* 影像位在文字待填块之前 —— 照片通常是最难凑齐、也最该先启动的一项，
            放前面才不会被当成可选项。信息公开类页面不配图。 */}
        {spec.image ? (
          <ImageSlot
            label={spec.image.label}
            hint={spec.image.hint}
            ratio={spec.image.ratio ?? "16/9"}
            art={spec.image.art}
            className="mb-10"
          />
        ) : null}

        {demo ? (
          <DemoBlocks blocks={demo} />
        ) : (
          <>
            <div className="grid gap-4">
              {spec.needs.map((need, i) => (
                <FactBlock key={i} label={need.label} hint={need.hint} />
              ))}
            </div>

            <p className="mt-10 text-caption text-fg-muted">
              需要提供的完整内容清单见仓库中的 <code>docs/CONTENT-CHECKLIST.md</code>。
            </p>
          </>
        )}
      </Section>
    </>
  );
}
