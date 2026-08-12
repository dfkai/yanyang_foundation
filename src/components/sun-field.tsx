import { cn } from "@/lib/cn";

/**
 * 首屏主视觉：暖阳光场
 * ---------------------------------------------------------------------------
 * 为什么不用照片 —— 基金会尚未提供真实的项目现场影像，而用 AI 生成的
 * 「受益人」「项目现场」类图片对公益机构是不可接受的：一旦被识破，对公信力
 * 的打击是毁灭性的，且《人工智能生成合成内容标识办法》（2025-09-01 施行）
 * 要求此类内容同时具备显式与隐式标识。用图库摆拍则是另一种失真。
 *
 * 所以首屏用光本身作主视觉：暖白底上一轮柔和的日光，呼应「上午的阳光打在
 * 白墙上」。全部由渐变绘制，零图片请求 —— LCP 元素因此落在标题文字上，
 * 这是首屏能达到的最快形态。拿到真实照片后，把它铺在本组件之下即可。
 *
 * 纯 CSS、零 JS，是 Server Component。为了玻璃导航能在其上真正「模糊出
 * 东西来」，这里的渐变层次是必要的 —— 玻璃背后没有内容时只会剩一个脏白框。
 */
export function SunField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* 日轮：从顶部偏右洒下的主光源 */}
      <div
        className="absolute -top-[38%] left-1/2 h-[52rem] w-[52rem] -translate-x-1/2 rounded-full opacity-90 sm:left-[62%]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.93 0.09 72 / 0.85) 0%, oklch(0.95 0.06 68 / 0.55) 32%, oklch(0.97 0.03 66 / 0.22) 58%, transparent 72%)",
        }}
      />
      {/* 地面反光：底部一层极淡的暖色回弹光 */}
      <div
        className="absolute -bottom-[30%] left-[8%] h-[34rem] w-[46rem] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, oklch(0.9 0.08 55 / 0.4) 0%, oklch(0.95 0.04 60 / 0.16) 45%, transparent 70%)",
        }}
      />
      {/* 一道斜射的光带，给平面一点方向感 */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "linear-gradient(122deg, transparent 0%, oklch(0.97 0.035 70 / 0.5) 38%, transparent 62%)",
        }}
      />
      {/* 细噪点：抵消大面积渐变必然出现的色带（banding）。
          用 SVG feTurbulence 生成，比位图噪点省得多。 */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
