import Link from "next/link";
import { home } from "@content/home";
import { primaryCta } from "@content/nav";
import { textOf } from "@content/site";
import { cn } from "@/lib/cn";
import { Fact } from "@/components/fact";
import { HeroPainting } from "@/components/hero-painting";
import { HeroSun } from "@/components/hero-sun";
import {
  StageCanvas,
  StageText,
  StageItem,
  StageLine,
  StageStats,
} from "@/components/hero-stage";
import { CountUp } from "@/components/count-up";
import { ClosingBanner } from "@/components/closing-banner";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/section";
import { HandRule } from "@/components/ui/hand-rule";
import { Badge } from "@/components/ui/badge";
import { ImageSlot } from "@/components/ui/image-slot";

/**
 * 首页
 * ---------------------------------------------------------------------------
 * 页面主体是 Server Component，只有动画包装器（hero-stage / count-up）是
 * 客户端组件 —— 这样既拿到 Motion 的编排能力，又不把整页推进 hydration。
 * 首屏不被 <Suspense> 包裹，LCP 元素是标题文字本身，零图片请求。
 */

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={cn("crayon", className)} fill="currentColor">
      <path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" />
    </svg>
  );
}

/** 数字滚动 + 占位判断：示意数字才滚，待填标记原样显示 */
function CountUpFact({ value, className }: { value: unknown; className?: string }) {
  const isSlot = typeof value === "object" && value !== null && "demo" in value;
  const demo = isSlot ? (value as { demo: string }).demo : null;
  const isDemo = process.env.NEXT_PUBLIC_DEMO === "1";

  if (isDemo && demo) return <CountUp value={demo} className={className} />;
  return (
    <span className={className}>
      <Fact value={value as string} />
    </span>
  );
}

export default function Home() {
  return (
    <>
      {/* ── 一、首屏 ───────────────────────────────────────────────────── */}
      {/* 文案直接压在画上，不套任何容器。图像位现在由这幅画顶着，拿到真实
          现场照片后把 HeroPainting 换成 next/image 即可，版式不用动。

          没有 overflow-hidden：底部数据条要靠负 margin 压到下一节上去，
          一裁就没了；画面自身的裁剪由 HeroPainting 内部负责。 */}
      {/* 高度封顶 58rem：min-h 只跟 svh 走的话，1080p 以上视口会把首屏拉到
          1000px 以上，而内容还贴在底部，上方空出七百多像素。
          文案区用 flex-1 居中吸收多余高度，数据条自然落在底部。 */}
      <section className="relative isolate flex min-h-[min(94svh,58rem)] flex-col overflow-x-clip">
        <StageCanvas>
          <HeroPainting />
        </StageCanvas>

        {/* 太阳是独立的一层：入场时从偏小、逆时针偏转转正放大（日出），
            之后随滚动极缓慢地继续旋转。烘在位图里就动不了了。 */}
        <HeroSun className="top-[-9%] right-[-5%] w-[clamp(13rem,44vw,44rem)] [aspect-ratio:1]" />

        <Container className="flex flex-1 items-center">
          <StageText className="relative max-w-2xl py-24 sm:py-28">
            {/* 标题逐行落下，每行自带 blur→0，比单纯位移更像「浮出来」 */}
            <h1 className="text-[clamp(2.25rem,5.6vw,4.5rem)] leading-[1.14] font-bold tracking-[-0.026em] text-fg">
              <StageLine>撒下一束光</StageLine>
              <StageLine>照亮一处角落</StageLine>
              <StageLine>温暖一颗心</StageLine>
            </h1>

            <StageItem className="mt-7 max-w-lg text-lead text-fg-muted">
              <Fact value={home.hero.lead} />
            </StageItem>

            <StageItem className="mt-9 flex flex-wrap items-center gap-3.5">
              <ButtonLink href={primaryCta.href} size="lg">
                {primaryCta.label}
                <Arrow className="size-4" />
              </ButtonLink>
              <ButtonLink href="/disclosure" variant="secondary" size="lg">
                查看信息公开
              </ButtonLink>
            </StageItem>
          </StageText>
        </Container>

        {/* 关键数字：最后入场，数字从 0 滚到目标值。这几个数是全页最硬的
            内容，值得一个明确的动作把视线钉住。 */}
        <Container>
          <StageStats className="paper-surface paper-edge relative -mb-14 overflow-hidden rounded-2xl sm:-mb-16">
            <dl className="grid grid-cols-2 lg:grid-cols-4">
              {home.stats.map((stat, i) => (
                <div
                  key={i}
                  className="border-border/40 px-6 py-7 not-lg:even:border-s not-lg:[&:nth-child(n+3)]:border-t lg:border-s lg:first:border-s-0 sm:px-8"
                >
                  <dd className="flex items-baseline gap-1">
                    <CountUpFact
                      value={stat.value}
                      className="sun-text text-[clamp(1.75rem,3.2vw,2.5rem)] leading-none font-bold tracking-[-0.02em] tabular-nums"
                    />
                    <span className="text-body font-medium text-accent">
                      {textOf(stat.unit)}
                    </span>
                  </dd>
                  <dt className="glass-text mt-2.5 text-caption text-fg-muted">
                    <Fact value={stat.label} />
                  </dt>
                </div>
              ))}
            </dl>
          </StageStats>
        </Container>
      </section>

      {/* ── 二、问题陈述 ──────────────────────────────────────────────── */}
      <Section className="pt-32 sm:pt-36" labelledBy="problem-title">
        <div className="reveal grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Eyebrow>{textOf(home.problem.eyebrow)}</Eyebrow>
            <h2
              id="problem-title"
              className="mt-5 text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.25] font-bold tracking-[-0.02em] text-balance text-fg"
            >
              <Fact value={home.problem.title} />
            </h2>
          </div>
          <div className="text-body-lg whitespace-pre-line text-fg-muted lg:pt-3">
            <Fact value={home.problem.body} />
          </div>
        </div>
      </Section>

      {/* ── 三、我们做什么 ─────────────────────────────────────────────── */}
      {/* 上一版这里是三个一模一样的白盒子，是全页最平庸的地方。
          改成横向分隔的列表：编号 + 地域 + 大标题 + 描述，中文长标题有地方
          舒展，也更像一份严肃的项目清单而不是产品卡片墙。 */}
      <Section tone="subtle" className="sunfall" tornTop labelledBy="programs-title">
        <div className="reveal">
          <SectionHeading
            id="programs-title"
            eyebrow={textOf(home.programs.eyebrow)}
            title={<Fact value={home.programs.title} />}
            lead={<Fact value={home.programs.lead} />}
          />
        </div>

        <ul className="mt-14">
          {home.programs.items.map((item, i) => (
            <li key={i} className="reveal">
              {i === 0 ? <HandRule variant={2} /> : null}
              <Link
                href="/programs"
                className="sheen group grid gap-x-8 gap-y-4 py-8 transition-colors duration-(--duration-base) ease-(--ease-out-soft) hover:bg-surface focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring) sm:py-10 lg:grid-cols-[auto_1fr_1.1fr_auto] lg:items-baseline lg:px-6"
              >
                {/* 这里原本是 01/02/03。这几个项目是并列的，不是流程的第一步
                    第二步 —— 给并列内容编号只是装饰，不携带信息。换成起始年份：
                    坚持了多久，对公益机构是最硬的可信度信号。 */}
                <span className="flex items-baseline gap-1 text-caption text-fg-subtle tabular-nums">
                  <Fact value={item.since} />
                  <span className="text-[0.6875rem]">起</span>
                </span>
                <div>
                  <Badge variant="accent">
                    <Fact value={item.region} />
                  </Badge>
                  <h3 className="mt-1.5 text-[clamp(1.375rem,2.4vw,1.875rem)] leading-[1.3] font-bold tracking-[-0.015em] text-fg">
                    <Fact value={item.name} />
                  </h3>
                </div>
                <p className="text-body text-fg-muted">
                  <Fact value={item.summary} />
                </p>
                <span
                  aria-hidden="true"
                  className="flex size-10 items-center justify-center rounded-full bg-surface text-accent ring-1 ring-border transition-transform duration-(--duration-base) ease-(--ease-out-soft) group-hover:translate-x-1 not-lg:hidden"
                >
                  <Arrow className="size-4" />
                </span>
              </Link>
              <HandRule variant={i} />
            </li>
          ))}
        </ul>

        <p className="mt-8 text-caption text-fg-muted">
          <Fact value={home.statsNote} />
        </p>
      </Section>

      {/* ── 四、理事长致辞 ─────────────────────────────────────────────── */}
      <Section tone="warm" tornTop tornFlip labelledBy="chairman-title">
        <div className="reveal mx-auto max-w-4xl">
          <Eyebrow>{textOf(home.chairman.eyebrow)}</Eyebrow>
          <figure className="mt-8">
            <blockquote>
              {/* 中文引号用全角，不要拿拉丁引号凑合 */}
              <p
                id="chairman-title"
                className="quote-type text-[clamp(1.5rem,3vw,2.375rem)] leading-[1.65] text-balance text-fg"
              >
                <span aria-hidden="true" className="text-accent-visual">
                  「
                </span>
                <Fact value={home.chairman.quote} />
                <span aria-hidden="true" className="text-accent-visual">
                  」
                </span>
              </p>
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3 text-body text-fg-muted">
              <span aria-hidden="true" className="h-px w-8 bg-border-strong" />
              <Fact value={home.chairman.name} />
              <span className="text-fg-subtle">·</span>
              <Fact value={home.chairman.role} />
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* ── 五、一线故事 ──────────────────────────────────────────────── */}
      <Section tone="subtle" className="sunfall" tornTop labelledBy="story-title">
        <div className="reveal grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <Eyebrow>{textOf(home.story.eyebrow)}</Eyebrow>
            <h2
              id="story-title"
              className="mt-5 text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.25] font-bold tracking-[-0.02em] whitespace-pre-line text-fg"
            >
              <Fact value={home.story.title} />
            </h2>
            <p className="mt-6 max-w-md text-body-lg text-fg-muted">
              <Fact value={home.story.lead} />
            </p>
            <div className="mt-9">
              <ButtonLink href="/impact/stories" variant="secondary">
                查看更多故事
              </ButtonLink>
            </div>
          </div>

          <ImageSlot
            label="一线影像 · 待基金会提供"
            hint="项目现场或服务对象的真实照片，横构图，短边不小于 1600px。"
            ratio="4/3"
            art="school"
          />
        </div>
      </Section>

      {/* ── 六、透明度 ────────────────────────────────────────────────── */}
      <Section labelledBy="transparency-title">
        <div className="reveal grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-16">
          <SectionHeading
            id="transparency-title"
            eyebrow={textOf(home.transparency.eyebrow)}
            title={<Fact value={home.transparency.title} />}
            lead={<Fact value={home.transparency.body} />}
          />
          <ul>
            {[
              { label: "年度工作报告", meta: "每年 5 月 31 日前", href: "/disclosure/annual-report" },
              { label: "财务会计与审计报告", meta: "经审计", href: "/disclosure/financial" },
              { label: "章程与内部管理制度", meta: "形成后 30 日内", href: "/disclosure/charter" },
              { label: "慈善项目信息公开", meta: "结束后 3 个月内", href: "/disclosure/projects" },
            ].map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-center justify-between gap-4 py-5 transition-colors duration-(--duration-base) hover:text-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring)"
                >
                  <span className="text-body-lg font-medium text-fg group-hover:text-accent">
                    {item.label}
                  </span>
                  <span className="flex items-center gap-4">
                    <span className="text-caption text-fg-subtle not-sm:hidden">
                      {item.meta}
                    </span>
                    <Arrow className="size-4 shrink-0 text-accent transition-transform duration-(--duration-base) ease-(--ease-out-soft) group-hover:translate-x-1" />
                  </span>
                </Link>
                <HandRule variant={i} />
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── 七、支持我们 ──────────────────────────────────────────────── */}
      <Section tone="subtle" className="sunfall" tornTop tornFlip labelledBy="support-title">
        <div className="reveal">
          <SectionHeading
            id="support-title"
            eyebrow={textOf(home.support.eyebrow)}
            title={<Fact value={home.support.title} />}
          />
        </div>
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {home.support.ways.map((way, i) => (
            <li key={i} className="reveal">
              <Link
                href={way.href}
                className="lit-corner paper-edge group flex h-full flex-col rounded-2xl bg-surface p-7 transition-all duration-(--duration-base) ease-(--ease-out-soft) hover:-translate-y-0.5 hover:border-transparent hover:shadow-warm-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring)"
              >
                <span
                  aria-hidden="true"
                  className="flex size-9 items-center justify-center rounded-full text-caption font-semibold text-white shadow-warm-sm"
                  style={{ background: "var(--gradient-sun-line)" }}
                >
                  {i + 1}
                </span>
                <h3 className="mt-5 text-h4 text-fg">
                  <Fact value={way.title} />
                </h3>
                <p className="mt-3 flex-1 text-body text-fg-muted">
                  <Fact value={way.body} />
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-body font-medium text-accent">
                  了解详情
                  <Arrow className="size-4 transition-transform duration-(--duration-base) ease-(--ease-out-soft) group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── 八、结尾 ──────────────────────────────────────────────────── */}
      <ClosingBanner />
    </>
  );
}
