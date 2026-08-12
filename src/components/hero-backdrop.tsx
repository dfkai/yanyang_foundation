import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * 首屏画布：清晨的天光
 * ---------------------------------------------------------------------------
 * 走了两次弯路才到这版，两次都值得记下来：
 *
 *   v1  暖白底 + 一团高斯模糊光晕 —— 既没质感，玻璃也失效：backdrop-filter
 *       背后若是一片均匀浅色，什么都模糊不出来，只剩一个脏白框。
 *   v2  近黑底 + 暖橙日轮 —— 玻璃终于可见，但一个叫「艳阳」的基金会
 *       首页是黑的，这件事本身就荒谬。
 *
 * 正解是第三种：**明亮、但色彩在流动**。像日出后半小时的天空——暖金、蜜橘、
 * 淡霞层层叠着缓慢移动。这样玻璃有丰富的色彩可折射，整体又是亮的，
 * 「艳阳」和「液态玻璃」两个要求同时成立，不必二选一。
 *
 * 性能：光斑只动 transform（合成层），绝不动 blur 半径或 backdrop-filter
 * 本身 —— 后者每帧都要重做全屏采样，中低端安卓直接掉到 20fps。
 * 纯 CSS/SVG，零图片请求，Server Component。
 */
export function HeroBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* 天光底：从顶部的暖金过渡到底部的暖白，是整块画布的基调 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(172deg, oklch(0.955 0.055 84) 0%, oklch(0.972 0.036 74) 22%, oklch(0.985 0.018 66) 46%, var(--bg) 70%, var(--bg) 100%)",
        }}
      />

      {/* 流动的光斑。三块不同色相、不同周期，错开相位后不会回到同一构图 */}
      <div className="aurora-field">
        <div
          className="aurora-blob"
          style={
            {
              insetInlineEnd: "-14%",
              insetBlockStart: "-32%",
              width: "62%",
              height: "108%",
              background: "oklch(0.87 0.115 64)",
              opacity: 0.62,
              "--blob-blend": "normal",
              "--blob-blur": "110px",
              "--blob-dur": "24s",
              "--blob-dx": "-5%",
              "--blob-dy": "4%",
              "--blob-dy2": "-3%",
            } as CSSProperties
          }
        />
        <div
          className="aurora-blob"
          style={
            {
              insetInlineStart: "32%",
              insetBlockStart: "-30%",
              width: "44%",
              height: "78%",
              background: "oklch(0.93 0.075 88)",
              opacity: 0.55,
              "--blob-blend": "normal",
              "--blob-blur": "96px",
              "--blob-dur": "31s",
              "--blob-delay": "-8s",
              "--blob-dx": "6%",
              "--blob-dy": "5%",
              "--blob-dy2": "2%",
            } as CSSProperties
          }
        />
        <div
          className="aurora-blob"
          style={
            {
              insetInlineEnd: "6%",
              insetBlockEnd: "-42%",
              width: "48%",
              height: "72%",
              background: "oklch(0.91 0.055 38)",
              opacity: 0.4,
              "--blob-blend": "normal",
              "--blob-blur": "104px",
              "--blob-dur": "28s",
              "--blob-delay": "-15s",
              "--blob-dx": "-7%",
              "--blob-dy": "-4%",
              "--blob-dy2": "3%",
            } as CSSProperties
          }
        />
      </div>

      {/* 日轮本体。用满饱和的日光渐变，边缘清晰 —— 这块橙是整套设计里
          辨识度最高的东西，理应在首屏就出场，而不是等滚到理事长致辞才第一次
          见到。外圈用 box-shadow 铺一层同色辉光，把它和天光底缝合起来。 */}
      <div
        className="absolute rounded-full"
        style={{
          // 往右上出血：只露出左下那段弧，读作「正在升起」而不是一颗悬空的球，
          // 同时给标题让出呼吸空间
          insetInlineEnd: "-8%",
          insetBlockStart: "-26%",
          width: "min(38vw, 30rem)",
          aspectRatio: "1",
          background: "var(--gradient-sun-soft)",
          boxShadow: "0 0 150px 60px oklch(0.78 0.155 60 / 0.3)",
        }}
      />

      {/* 日轮内的同心环：极淡，凑近才看得见，但让那一大块橙不至于是死的平面 */}
      <div
        className="absolute rounded-full opacity-[0.13]"
        style={{
          insetInlineEnd: "-8%",
          insetBlockStart: "-26%",
          width: "min(38vw, 30rem)",
          aspectRatio: "1",
          background:
            "repeating-radial-gradient(circle at 36% 30%, transparent 0 22px, oklch(1 0 0 / 0.5) 22px 23px)",
          maskImage: "radial-gradient(circle at 36% 30%, #000 20%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(circle at 36% 30%, #000 20%, transparent 78%)",
        }}
      />

      {/* 日轮的骨架：只留同心弧线，不再填一大片亮橙。
          光的结构由线条给出，颜色由上面的光斑给出，两者分工。 */}
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="yy-arc-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="58%" stopColor="#fff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="yy-arc-mask">
            <circle cx="1218" cy="96" r="880" fill="url(#yy-arc-fade)" />
          </mask>
        </defs>

        <g
          mask="url(#yy-arc-mask)"
          fill="none"
          stroke="oklch(0.62 0.14 52)"
          strokeOpacity="0.15"
        >
          <circle cx="1218" cy="96" r="186" strokeWidth="1.5" />
          <circle cx="1218" cy="96" r="268" strokeWidth="1" />
          <circle cx="1218" cy="96" r="372" strokeWidth="1" />
          <circle cx="1218" cy="96" r="498" strokeWidth="1.25" />
          <circle cx="1218" cy="96" r="648" strokeWidth="1" />
          <circle cx="1218" cy="96" r="822" strokeWidth="1" />
        </g>
      </svg>

      {/* 网格：给大片明亮留白一点结构，边缘用径向遮罩化掉，不留硬边 */}
      <div
        className="grid-lines absolute inset-0"
        style={
          {
            "--grid-size": "72px",
            "--grid-color": "oklch(0.5 0.07 55 / 0.07)",
            "--grid-origin": "62% 22%",
            "--grid-fade": "86% 78%",
          } as CSSProperties
        }
      />

      {/* 噪点：压住大面积渐变必然出现的色带 */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
