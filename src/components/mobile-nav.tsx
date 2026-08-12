"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { NavItem } from "@content/nav";
import { BrandLockup } from "./brand-mark";

/**
 * 移动端导航抽屉
 * ---------------------------------------------------------------------------
 * 用原生 <dialog> + showModal()：焦点陷阱、Esc 关闭、惰性化背景内容全部由
 * 浏览器提供，比手写一套可靠得多，也省掉一个焦点管理库。
 *
 * 这是整个 header 里唯一的客户端组件 —— 桌面导航、logo、CTA 全部留在
 * Server Component 里，不参与 hydration。
 */
export function MobileNav({ items }: { items: NavItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  // 抽屉里的链接一被点击就关闭 —— 直接在事件里处理，
  // 不需要监听 pathname 再用 effect 反向同步 state。
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="tap-target rounded-full text-fg transition-colors hover:bg-bg-subtle focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring) lg:hidden"
      >
        <span className="sr-only">打开导航菜单</span>
        <svg viewBox="0 0 20 20" aria-hidden="true" className="size-6 fill-current">
          <path d="M3 5.5A1 1 0 0 1 4 4.5h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm0 4.5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm1 3.5a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2H4Z" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-nav"
        onClose={() => setOpen(false)}
        aria-label="站点导航"
        className="m-0 h-dvh max-h-dvh w-full max-w-none bg-bg p-0 text-fg backdrop:bg-black/40 lg:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-18 shrink-0 items-center justify-between border-b border-border px-6">
            <BrandLockup />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="tap-target -me-2 rounded-full text-fg-muted hover:bg-bg-subtle hover:text-fg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring)"
            >
              <span className="sr-only">关闭导航菜单</span>
              <svg viewBox="0 0 20 20" aria-hidden="true" className="size-6 fill-current">
                <path d="M5.3 4.3a1 1 0 0 1 1.4 0L10 7.58l3.3-3.3a1 1 0 1 1 1.4 1.42L11.42 9l3.3 3.3a1 1 0 0 1-1.42 1.4L10 10.42l-3.3 3.3a1 1 0 0 1-1.4-1.42L8.58 9l-3.3-3.3a1 1 0 0 1 0-1.4Z" />
              </svg>
            </button>
          </div>

          <nav aria-label="站点导航" className="flex-1 overflow-y-auto px-6 py-6">
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="block rounded-lg px-3 py-3 text-h4 text-fg transition-colors hover:bg-bg-subtle focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring)"
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <ul className="mt-0.5 mb-2 ms-3 space-y-0.5 border-s border-border ps-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={close}
                            className="block rounded-md px-2 py-2 text-body text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring)"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </dialog>
    </>
  );
}
