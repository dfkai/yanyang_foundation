import Link from "next/link";
import { primaryNav, primaryCta } from "@content/nav";
import { BrandLockup } from "./brand-mark";
import { DisplayPrefs } from "./display-prefs";
import { MobileNav } from "./mobile-nav";
import { ButtonLink } from "./ui/button";
import { Container } from "./ui/section";

/**
 * 顶部导航
 * ---------------------------------------------------------------------------
 * 浅色玻璃 + 居中导航。首屏是明亮且色彩流动的暖阳画布，玻璃压在上面
 * 才真正有东西可折射 —— 玻璃背后若是一片均匀的纯色，backdrop-filter
 * 什么也模糊不出来，只会剩一个脏白框。
 *
 * 这是全站唯一常驻的玻璃元素。Apple HIG 把液态玻璃定义为「导航与控件的
 * 功能层」，并明文禁止用在内容层 —— 本站严格遵守：项目列表、年报表格、
 * 财务数据一律实色。这条规则顺带把同屏 backdrop-filter 实例数压到个位数。
 *
 * 注意：backdrop-filter 会被祖先链上的 opacity<1、任何 filter、
 * will-change:opacity 静默破坏，且浏览器不报任何错误。
 */
export function SiteHeader() {
  return (
    <header className="glass-nav sticky top-0 z-40">
      <Container>
        <div className="relative flex h-18 items-center justify-between gap-4">
          <Link
            href="/"
            className="relative z-10 rounded-lg focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-(--focus-ring)"
          >
            <BrandLockup />
            <span className="sr-only">返回首页</span>
          </Link>

          {/* 绝对定位居中：导航项在视觉上正对版心中线，
              不受左右两侧宽度变化的影响 */}
          <nav
            aria-label="主导航"
            className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
          >
            <ul className="flex items-center gap-0.5">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="glass-text block rounded-full px-3 py-2 text-[0.9375rem] whitespace-nowrap text-fg-muted transition-colors duration-(--duration-fast) hover:bg-black/[0.06] hover:text-fg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring)"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-1.5">
            <DisplayPrefs />
            {/* 用包装元素控制显隐，而不是给按钮加 hidden：
                按钮基类里已有 inline-flex，两个 display 工具类同层冲突时
                谁赢取决于 Tailwind 的输出顺序 —— 实测 inline-flex 会覆盖
                hidden，按钮在移动端照样显示并把导航栏撑成两行。 */}
            <div className="hidden md:block">
              <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
            </div>
            <MobileNav items={primaryNav} />
          </div>
        </div>
      </Container>
    </header>
  );
}
