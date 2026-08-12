import { ButtonLink } from "./ui/button";
import { Container } from "./ui/section";
import { primaryCta } from "@content/nav";

/**
 * 结尾区块
 * ---------------------------------------------------------------------------
 * 满幅日光 + 一个撑满宽度、被底边裁切的巨字标。给整页一个明确的结束感和
 * 记忆点 —— 从最后一个内容区直接掉进页脚，读起来像话没说完。
 *
 * 收尾用日光而不是深色：整站的节奏靠饱和度起伏，明暗交替是从别处借来的
 * 语言，放在「艳阳」这两个字上不成立。
 *
 * 巨字用极低对比度（8% 前景色）：它是版式重量，不是要人去读的内容，
 * 所以标了 aria-hidden，屏幕阅读器会跳过。
 */
export function ClosingBanner() {
  return (
    <section className="surface-warm relative overflow-hidden">
      <Container>
        <div className="relative z-10 flex flex-col items-center gap-8 py-24 text-center sm:py-32">
          <h2 className="max-w-[18ch] text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.25] font-bold tracking-[-0.025em] text-balance text-fg">
            了解我们在做的事
          </h2>
          <p className="max-w-md text-body-lg text-fg-muted">
            教育与医疗两条项目线，覆盖 37 个县域。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ButtonLink href={primaryCta.href} size="lg">
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary" size="lg">
              联系我们
            </ButtonLink>
          </div>
        </div>
      </Container>

      {/* 巨字标：撑满视口宽度并被底边裁掉一截，读作「继续向下」而不是一个句号 */}
      <p
        aria-hidden="true"
        className="pointer-events-none -mb-[2.5vw] block text-center text-[19.2vw] leading-[0.78] font-bold tracking-[-0.05em] whitespace-nowrap text-white/[0.13] select-none"
      >
        艳阳基金会
      </p>
    </section>
  );
}
