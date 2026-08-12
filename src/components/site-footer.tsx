import Link from "next/link";
import { footerNav, legalNav } from "@content/nav";
import { foundation, features, site, isPlaceholder } from "@content/site";
import { BrandLockup } from "./brand-mark";
import { Fact } from "./fact";
import { Container } from "./ui/section";

/**
 * 页脚
 * ---------------------------------------------------------------------------
 * 中国大陆基金会官网页脚的固定配置，对标壹基金 / 南都公益基金会 /
 * 中国乡村发展基金会的实际做法：机构法定信息、慈善中国查验入口、
 * 投诉举报渠道、ICP 备案号 + 公安联网备案号。
 *
 * 其中最关键的一条是无公开募捐资格时的显式声明 —— 没有这句话，
 * 官网上任何形似捐赠入口的元素都可能被认定为面向不特定公众的公开募捐。
 */
export function SiteFooter() {
  const hasIcp = !isPlaceholder(foundation.icpBeian) && foundation.icpBeian.length > 0;
  const hasGongan =
    !isPlaceholder(foundation.gonganBeian) && foundation.gonganBeian.length > 0;

  return (
    <footer className="border-t border-border bg-bg-subtle">
      <Container>
        <div className="grid gap-12 py-16 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <BrandLockup />
            <p className="mt-4 max-w-sm text-body text-fg-muted">
              <Fact value={site.tagline} />
            </p>
          </div>

          {/* 四组 × 四条。页脚不是站点地图的副本 —— 按「来到页脚的人想做
              什么」分组，其余入口一级导航里都有，不必重复一遍。 */}
          <nav aria-label="页脚导航">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-9 sm:grid-cols-4">
              {footerNav.map((group) => (
                <li key={group.title}>
                  <h2 className="text-caption font-semibold tracking-[0.04em] text-fg">
                    {group.title}
                  </h2>
                  <ul className="mt-3.5 space-y-2.5">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-caption text-fg-muted transition-colors hover:text-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring)"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* 机构合规信息 —— 这一段的每一项都必须是可查证的真实信息 */}
        <div className="border-t border-border py-10">
          <h2 className="sr-only">机构合规信息</h2>
          <dl className="grid gap-x-8 gap-y-3 text-caption text-fg-muted sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-fg">登记名称</dt>
              <dd>
                <Fact value={foundation.legalName} />
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-fg">统一社会信用代码</dt>
              <dd>
                <Fact value={foundation.unifiedSocialCreditCode} />
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-fg">登记管理机关</dt>
              <dd>
                <Fact value={foundation.registrationAuthority} />
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-fg">投诉举报</dt>
              <dd>
                <Fact value={foundation.complaintPhone} />
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-fg">联系邮箱</dt>
              <dd>
                <Fact value={foundation.email} />
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-fg">办公地址</dt>
              <dd>
                <Fact value={foundation.address} />
              </dd>
            </div>
          </dl>

          {/* 「慈善中国」是国务院民政部门建立的全国慈善信息公开平台。
              民政部令第 81 号要求：慈善组织在其他渠道公布的信息，
              必须与统一平台上公布的一致。放查验入口既是惯例也是自我约束。 */}
          <p className="mt-6 text-caption text-fg-muted">
            {isPlaceholder(foundation.charityChinaUrl) ? (
              <>
                在「慈善中国」全国慈善信息公开平台查验本机构：
                <Fact value={foundation.charityChinaUrl} />
              </>
            ) : (
              <a
                href={foundation.charityChinaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-4"
              >
                在「慈善中国」全国慈善信息公开平台查验本机构
              </a>
            )}
          </p>

          {!features.hasPublicFundraising ? (
            <p className="mt-4 rounded-lg border border-border bg-surface px-4 py-3 text-caption text-fg-muted">
              本会目前不具有公开募捐资格，不面向社会公众开展公开募捐。
              如有合作或定向支持意向，请通过
              <Link href="/contact" className="mx-1 text-accent underline underline-offset-4">
                联系我们
              </Link>
              与本会洽谈。
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 border-t border-border py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption text-fg-muted">
            © {new Date().getFullYear()} {site.name}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-caption text-fg-muted hover:text-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring)"
              >
                {item.label}
              </Link>
            ))}
            {hasIcp ? (
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-caption text-fg-muted hover:text-accent"
              >
                {foundation.icpBeian}
              </a>
            ) : null}
            {hasGongan ? (
              <a
                href="https://beian.mps.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-caption text-fg-muted hover:text-accent"
              >
                {foundation.gonganBeian}
              </a>
            ) : null}
          </div>
        </div>
      </Container>
    </footer>
  );
}
