"use client";

import { useEffect } from "react";

/**
 * 入场动画
 * ---------------------------------------------------------------------------
 * 分工：
 *   layout 里的内联脚本  在首帧前打上 data-reveal="on"，元素才变成初始隐藏
 *                        （尊重 prefers-reduced-motion：偏好减少动效时不打标记）
 *   本组件              注册 IntersectionObserver，进入视口后加 is-in 淡入
 *
 * 关键约束：没有这两者中的任何一个，内容都必须是可见的。CSS 里 .reveal 的
 * 默认状态就是 opacity:1，隐藏只发生在 data-reveal="on" 之下 —— 这样无论
 * JS 失败、被禁用还是动画路径异常，内容都不会消失。
 *
 * 触发后立即 unobserve，避免长期回调拖累主线程与 INP。
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.reveal !== "on") return;

    const targets = document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)");
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
            {
        // 负值等于「进视口 10% 才触发」，滚到了还要等一下，读起来就是「慢」。
        // 改成正值：元素还在视口下方 14% 时就开始，滚到位时动画已接近完成。
        rootMargin: "0px 0px 14% 0px",
        threshold: 0,
      },
    );

    targets.forEach((el) => io.observe(el));

    // 兜底：万一观察者因任何原因没触发（旧版浏览器怪癖、页面被截图工具
    // 以非常规方式渲染），2 秒后无条件放行，绝不把内容永久留在不可见状态。
    const failsafe = window.setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.is-in)")
        .forEach((el) => el.classList.add("is-in"));
    }, 2000);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return null;
}
