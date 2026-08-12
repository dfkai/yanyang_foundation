"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Theme = "system" | "light" | "dark";

/**
 * 偏好的真实存放位置是 <html> 的 data 属性 + localStorage，不是 React state。
 * 这两个写函数放在组件外：它们只跟 DOM 与存储打交道，与渲染无关。
 */
function writeTheme(next: Theme) {
  const el = document.documentElement;
  if (next === "system") {
    delete el.dataset.theme;
    localStorage.removeItem("yy-theme");
  } else {
    el.dataset.theme = next;
    localStorage.setItem("yy-theme", next);
  }
}

function writeGlass(off: boolean) {
  const el = document.documentElement;
  if (off) {
    el.dataset.glass = "off";
    localStorage.setItem("yy-glass", "off");
  } else {
    delete el.dataset.glass;
    localStorage.removeItem("yy-glass");
  }
}

/**
 * 显示偏好
 * ---------------------------------------------------------------------------
 * 站内自建的「降低透明度」开关，是本站无障碍的第一道防线而不是补充。
 *
 * 原因是一个很讽刺的事实：prefers-reduced-transparency 在 Safari 上永远
 * 不会被支持（WebKit 以指纹识别为由明确反对该标准），而 Apple 生态的用户
 * 恰恰是最可能开启系统「降低透明度」的那批人。也就是说，最需要这个降级的
 * 用户，浏览器根本不告诉我们。
 *
 * 对一个受众年龄跨度大、视力障碍比例高于平均的公益机构，这个开关是必需品。
 *
 * 面板状态在「打开时」从 DOM 读一次即可 —— 不需要 effect 去同步初始值，
 * 因为面板默认关闭，读取一定发生在客户端。
 */
export function DisplayPrefs() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("system");
  const [glassOff, setGlassOff] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function togglePanel() {
    if (!open) {
      // 值是内联脚本在首帧前写上去的，这里只做读取
      const el = document.documentElement;
      setTheme((el.dataset.theme as Theme) || "system");
      setGlassOff(el.dataset.glass === "off");
    }
    setOpen((v) => !v);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (
        !panelRef.current?.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={togglePanel}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="tap-target rounded-full text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring)"
      >
        <span className="sr-only">显示偏好设置</span>
        <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 fill-current">
          <path d="M10 2a1 1 0 0 1 1 1v1.06a6 6 0 0 1 1.86.77l.75-.75a1 1 0 1 1 1.41 1.41l-.75.75c.36.57.63 1.2.77 1.86H16a1 1 0 1 1 0 2h-1.06a6 6 0 0 1-.77 1.86l.75.75a1 1 0 0 1-1.41 1.41l-.75-.75a6 6 0 0 1-1.86.77V16a1 1 0 1 1-2 0v-1.06a6 6 0 0 1-1.86-.77l-.75.75a1 1 0 0 1-1.41-1.41l.75-.75A6 6 0 0 1 4.06 11H3a1 1 0 1 1 0-2h1.06a6 6 0 0 1 .77-1.86l-.75-.75a1 1 0 0 1 1.41-1.41l.75.75A6 6 0 0 1 8.14 4.06V3a1 1 0 0 1 1-1Zm0 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
        </svg>
      </button>

      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="显示偏好设置"
          className="glass-panel glass-rim absolute end-0 top-[calc(100%+0.75rem)] z-50 w-72 p-5"
        >
          <fieldset>
            <legend className="text-caption font-semibold tracking-wide text-fg-muted">
              主题
            </legend>
            <div className="mt-2.5 flex gap-1.5 rounded-full bg-bg-subtle p-1">
              {(
                [
                  ["system", "跟随系统"],
                  ["light", "浅色"],
                  ["dark", "深色"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    writeTheme(value);
                    setTheme(value);
                  }}
                  aria-pressed={theme === value}
                  className={cn(
                    "flex-1 rounded-full px-2 py-1.5 text-caption whitespace-nowrap transition-colors",
                    theme === value
                      ? "bg-surface text-fg shadow-warm-xs"
                      : "text-fg-muted hover:text-fg",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-5 border-t border-border pt-4">
            <label className="flex cursor-pointer items-start justify-between gap-3">
              <span>
                <span className="text-body font-medium text-fg">降低透明度</span>
                <span className="mt-0.5 block text-caption text-fg-muted">
                  关闭毛玻璃效果，改用实色背景，提高文字清晰度
                </span>
              </span>
              <input
                type="checkbox"
                checked={glassOff}
                onChange={(e) => {
                  writeGlass(e.target.checked);
                  setGlassOff(e.target.checked);
                }}
                className="mt-1 size-5 shrink-0 accent-(--accent)"
              />
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * 首帧前应用已保存的偏好，避免主题/透明度闪烁，并决定是否启用入场动画。
 * 必须是同步内联脚本 —— 放进 useEffect 就已经晚了。
 *
 * 它会往 <html> 写 data-theme / data-glass / data-reveal，服务端渲染时
 * 不可能知道这些值，所以 layout 的 <html> 上标了 suppressHydrationWarning。
 */
export const displayPrefsScript = `(function(){try{
var e=document.documentElement,t=localStorage.getItem("yy-theme"),g=localStorage.getItem("yy-glass");
if(t==="light"||t==="dark")e.dataset.theme=t;
if(g==="off")e.dataset.glass="off";
if(!matchMedia("(prefers-reduced-motion: reduce)").matches)e.dataset.reveal="on";
}catch(_){}})();`;
