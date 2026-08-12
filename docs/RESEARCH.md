# 技术与设计调研 · 决策记录

调研时点 2026-08。这份文档记录的是**为什么这么做**，以及**哪些流行说法经核实是错的**。

---

## 一、技术栈（已锁定，均为实查 npm 的当前版本）

| 库 | 版本 | 说明 |
|---|---|---|
| Next.js | 16.3.0 | App Router，Turbopack 已是默认打包器 |
| React / React DOM | 19.2.8 | |
| Tailwind CSS | 4.3.3 | CSS-first 配置，无 `tailwind.config.js` |
| TypeScript | 5.9.3 | **不用 7.0.2** —— TS 7（Go 重写的原生编译器）刚发布，生态未跟上 |
| subset-font | 2.5.0 | 字体子集化，harfbuzz 内核 |

**没有引入的东西**，以及原因：

- **任何 `liquid-glass-*` npm 包。** `liquid-glass-react` 有 5878 star、13.9 万月下载，但最后一次提交是 2025-06-13，24 个 open issue 里作者自己写着 "unusable. made purely for demo"。核心 CSS 不过百来行，自己写完全可控，把基金会官网押在一个已弃坑的 demo 库上不可接受。
- **React `<ViewTransition>` / 页面切换过渡。** 调研 agent 称其为「React 19.2 特性」，实测 `Object.keys(require('react'))` 里**根本没有这个导出**。不做页面过渡，省下的复杂度花在别处。
- **动效库（Motion 等）。** 入场动画只需要一个 IntersectionObserver，不值得为此引入运行时依赖。
- **UI 组件库。** 站点组件量小且高度定制，shadcn 那套 registry 的价值在这里体现不出来。

---

## 二、色板：实算而非手感

品牌种子色 `#F2711C`（琥珀橙）经 OKLCH 展开成色阶，每个关键组合都实算了 WCAG 对比度。**一个想当然的方案当场出局**：

| 组合 | 对比度 | 结论 |
|---|---|---|
| 白字 / 品牌橙 `#F3721E` | **2.90:1** | ✗ 远不达 AA。「橙底白字」是这套配色最容易踩的坑 |
| 白字 / brand-600 `#D75800` | 3.97:1 | ✗ 仅够大字级 |
| **品牌橙底 + 深琥珀字**（brand-500 + brand-950） | **5.40:1** | ✓ **主按钮采用**，既达 AA 又保住「艳阳」的亮度 |
| 白字 / brand-700 `#AF4200` | 5.83:1 | ✓ 达标但偏砖红，不够亮 |
| 链接 brand-700 / 页面底 | 5.57:1 | ✓ 链接文字采用 |
| 正文 sand-900 / 页面底 | 14.87:1 | ✓ |
| 次要 sand-600 / 页面底 | 5.07:1 | ✓ |
| 弱化 sand-500 / 页面底 | 3.23:1 | ✗ **不可作文字**，只能用作边框与图标 |

暗色主题另算一套：正文 17.45:1、链接 brand-400 为 8.96:1、按钮 brand-400 配暗色字 8.96:1，全部通过。

玻璃面板的对比度按**合成后的实际渲染色**算，而不是 CSS 里写的颜色。白玻璃在最坏背景（纯黑照片）下：alpha 0.55 → 4.63:1，alpha 0.72 → 7.4:1。本站导航取 0.72，浮层取 0.84。

> Lighthouse / axe-core 读的是 CSS 声明色，**测不出 backdrop-filter 合成后的真实对比度**，玻璃面板会拿到"无问题"的假阳性通过。不能作为唯一依据。

---

## 三、液态玻璃：学什么、不学什么

### Apple 的硬规则

Liquid Glass 于 WWDC25 发布（iOS/macOS 26），2026 年 WWDC26 重做了材质底层（扩散算法、darkened edge、更亮的镜面高光、全局强度滑块）。Apple 自己**三次下调过透明度**：iOS 26 beta 3 降透明度、iOS 26.1 加 Clear/Tinted 二选一、iOS 27 升级为连续滑块。官方立场很清楚：**可读性优先于透明度**。

HIG 原文的两条硬规则，本站严格遵守：

1. **「Don't use Liquid Glass in the content layer.」** 玻璃是导航与控件的功能层。本站玻璃只出现在：顶部导航、移动端抽屉、显示偏好浮层、首屏数据条。项目卡片、年报表格、财务数据、隐私政策**一律实色**。
2. **不要玻璃套玻璃。** 玻璃之上的元素用填充与透明度表达层级。

这条规则顺带解决了性能问题 —— 同屏 backdrop-filter 实例数被自然压到个位数。

### 刻意没做的：SVG 折射

真实的折射效果需要 `backdrop-filter: url(#svg-filter)`，而这**只有 Chromium 支持**（WebKit bug 245510 至今 NEW）。慈善基金会受众里 iOS Safari 占比极高，等于给多数用户做了个看不到的效果，却让所有人承担 canvas + 滤镜的复杂度与性能开销。这份预算花在排版、可读性和加载速度上更值。

替代做法是用**同心圆角 + 边缘高光 + 克制的着色**去传达同一种气质：

- 同心圆角公式 `inner = outer − padding`，按钮统一 capsule（半径 = 高度 50%）。这是最能一眼读出「当代 Apple 语言」的信号，而且**完全不依赖玻璃** —— 把所有 backdrop-filter 拿掉这条依然成立。
- 顶部 1px inset 高光模拟镜面反射，外圈淡暗描边对应 iOS 27 新增的 darkened edge，边缘一道暖金渐变呼应「暖阳」方向。

### 实测得到的几个坑

- **`@supports (backdrop-filter: url(#x))` 是假阳性。** Firefox 与 Chrome 都返回 true，但只有 Chromium 真的绘制。全网教程（含 LogRocket）推荐的这个降级检测**完全不работа**。
- **祖先链上的 `opacity < 1`、任何 `filter`、`will-change: opacity` 会静默破坏 backdrop-filter**，浏览器不报任何错误。React 里做淡入动画极易踩中。而 `transform: translateZ(0)`、`overflow: hidden`、`contain: paint`、`isolation: isolate` 都是安全的 —— 常被误认为有害的 translateZ 实测无害。
- **`-webkit-backdrop-filter` 必写**，Safari 9–17.x 只认前缀版。
- **`mask-composite` 要双写**：`-webkit-mask-composite: xor` + `mask-composite: exclude`（关键字不同名，不是同一个词加前缀）。
- **Safari 26+ 会拿视口边缘 fixed/sticky 元素的背景色去染工具栏**，且不再读 `theme-color`。所以 html/body 必须有显式背景色。

### 无障碍：四条防线而非一条

`prefers-reduced-transparency` **在 Safari 上永远不会被支持**（WebKit 以指纹识别为由明确反对该标准）。讽刺的是，Apple 生态用户恰恰是最可能开启系统「降低透明度」的那批人 —— 最需要降级的用户，浏览器根本不告诉我们。

所以本站四管齐下：

1. `@media (prefers-reduced-transparency: reduce)` —— Chrome 118+
2. `@media (prefers-contrast: more)` —— Safari 14.1+ 真实可用，且 macOS 开启「增强对比度」会连带开启「降低透明度」，是 Apple 平台的可靠代理信号
3. `@media (forced-colors: active)` —— Windows 高对比度
4. **站内自建开关** —— 页眉的设置按钮，写入 `<html data-glass="off">` 并持久化。对受众年龄跨度大的公益站，这是必需品而非锦上添花

---

## 四、中文排版

### 字体：一个偏离常规建议的决策

调研建议正文也自托管中文字体（top-2500 子集约 420KB）。**没有采纳。**

正文走系统字体栈（苹方 / 微软雅黑 / 思源黑体，**0 字节**），只给展示级标题加载 Noto Sans SC 700 子集（**约 187KB**，站内实际用字 + 高频兜底）。理由：中文系统字体在所有目标平台都是高质量黑体，与思源黑体字形极为接近，420KB 换不来可感知的视觉提升，却直接压在 LCP 和 CLS 上。

实测体积对照（Noto Sans SC，静态字重）：

| 方案 | 体积 |
|---|---|
| 源文件完整 TTF | 16.95 MB |
| Google Fonts CDN（一个 260 字的真实页面实际命中） | 462.9 KB（静态）/ 871.5 KB（可变） |
| 构建期子集 top-3500 | 560.1 KB |
| 构建期子集 top-2500 | 409.4 KB |
| **本站：标题 700 + 站内实际用字** | **186.5 KB** |

另外两条反直觉的实测结论：

- **CJK 可变字体不省体积，反而更费** —— 一个可变字体 ≈ 1.9 个静态字重（31,036 个字形每个都要存 gvar 增量数据）。只有真需要 3 个以上字重才划算。
- **Google Fonts 的中文分包对短页面很不划算** —— CSS 只有 113KB 很有迷惑性，但汉字散落在多个高频片区，一个 260 字的页面也会拖下 16 个 woff2 分片。

字表也踩了一个坑：调研 agent 提供的 `top3500.txt` **是繁体字表**（個、來、爲、學、會），另一个字表文件干脆是个 404 页面。最终用 **GB2312 编码区间**（只收简体，天然把繁体挡在外面）交叉 rime-essay 词频语料重新生成，top-2500 覆盖行文 99.22%。

授权方面：Noto Sans SC / 思源黑体 / 霞鹜文楷均为 SIL OFL 1.1，明确允许商用、子集化与 webfont 分发。**HarmonyOS Sans 与 MiSans 不能用于 web** —— 两者都是自订 EULA，禁止修改字体文件（子集化在法律上就是修改）与单独分发（挂 CDN 就是分发）。

### 排版数值

- 正文行高 **1.8**（中文是全字身、无升降部，英文站的 1.5 搬到中文相当于 1.3，必然拥挤）
- 标题行高 1.08–1.5，且必须用**负字距**（−0.012em ~ −0.028em）抵消全角字面
- 正文行宽 `max-width: 40rem` ≈ 36 汉字/行
- 段间距优于首行缩进 —— Web 上行宽多变，缩进比例会失真
- **不用首行缩进**

`:root` 上的四行关键 CSS：

```css
text-autospace: normal;        /* 中英文自动间距。不写就没有效果 —— */
                               /* 三家浏览器的实际初始值都是 no-autospace，与规范不符 */
text-spacing-trim: trim-start; /* 行首标点挤压，Chromium 生效，其余优雅降级 */
line-break: strict;            /* 避头尾：句读不落行首 */
font-synthesis-weight: none;   /* 中文伪粗是横向涂抹，密笔画字会糊成黑块 */
```

标题用 `text-wrap: balance`，长中文标题用 `pretty` 避免孤字。

---

## 五、性能与无障碍

Core Web Vitals 阈值自 2024 年至今**未变**（LCP ≤2.5s / INP ≤200ms / CLS ≤0.1，按 CrUX 真实用户 75 分位）。搜到的一堆「2026 CWV 有新指标」的 SEO 文章均无官方来源。

本站的结构性决策：

- **首屏 Hero 零客户端组件，且不被 `<Suspense>` 包裹。** 玻璃、光晕、渐变全是纯 CSS，LCP 元素是标题文字本身。首页整页没有一个 `'use client'`。
- 全站只有三个客户端组件：移动端抽屉、显示偏好面板、入场动画观察者。
- **首屏零图片请求** —— 主视觉是 CSS 渐变绘制的暖阳光场。
- 移动端 `--glass-blur` 从 20px 降到 10px（blur 成本约 O(r²)，半径翻倍成本约 4 倍）。

WCAG 2.2 AA 里对玻璃风站点最致命的两条，都已处理：

- **SC 2.4.11 Focus Not Obscured** —— 粘性玻璃导航会把 Tab 到的元素完全遮住。修法是 `scroll-padding-top` + `[id] { scroll-margin-top }`，自动化工具查不出这个问题。
- **SC 2.5.8 Target Size** —— 可点目标 ≥24×24 CSS px。玻璃风设计里图标常做得很精致小巧，是高发区。本站图标按钮统一 44×44。

`prefers-reduced-motion` 实现为**压缩时长到 0.01ms 而不是 `animation: none`** —— 后者会让依赖 `animationend` / `transitionend` 的逻辑永远等不到回调而卡死。另外单独关掉了 `::view-transition-*` 伪元素的默认 crossfade，这一条几乎所有教程都漏。

### 一个在实测中抓到的严重 bug

入场动画最初用 `animation-timeline: view()` 的纯 CSS 方案（零 JS，看起来更优雅），`.reveal` 初始 `opacity: 0`。**整页截图时发现全站内容都是空白** —— 这条动画路径在某些渲染路径下不触发，内容就永远不可见。

改成：`.reveal` 默认 `opacity: 1`，只有内联脚本在首帧前打上 `data-reveal="on"` 后才变成初始隐藏，再由 IntersectionObserver 淡入，另加 2 秒兜底无条件放行。**内容绝不能因为动画路径失灵而消失** —— 可靠性优先于省下一个观察者。

---

## 六、部署与合规（待你决策）

### Vercel 与 ICP 备案的冲突

ICP 备案要求接入商与服务器在中国大陆境内，**Vercel 托管的站点无法办理备案**；同时 Vercel 在大陆存在 DNS 污染与访问不稳定。

你选择的是「主要给海外、不在意大陆速度」，所以当前按 Vercel 直接部署规划。但有两点要留意：

1. 受众那题你选的是「纯中文、大陆为主」，两者存在张力。如果实际用户在大陆，首屏可能需要 3–5 秒。
2. **不要用 .cn 域名指向 Vercel** —— .cn 未备案会被直接停止解析。

零成本的缓解措施：自定义域名的 CNAME 指向 `cname-china.vercel-dns.com`（Vercel 的中国优化入口）。若后续需要大陆稳定访问，终局方案是 ICP 备案 + 国内 CDN，届时域名要能备案（选 .org/.com，注册商支持备案）。

### 结构化数据

用 schema.org 的 `NGO`（`Organization` 的子类）。**不要填 `nonprofitStatus`** —— 它的取值枚举 `NonprofitType` 只有美国（501c3 等）和荷兰体系，**没有中国慈善组织类型**，硬填是错误数据。改用 `taxID` 承载统一社会信用代码、`sameAs` 指向「慈善中国」组织页做权威关联。

### 百度

技术上不需要为百度做任何改造 —— 本站是服务端渲染，百度可正常抓取。要做的只是提交侧：`robots.ts` 已显式放行 `Baiduspider`，`sitemap.ts` 刻意用**扁平单文件**（百度不受理索引型 sitemap，且站内存在索引型文件时会禁止提交新文件）。

hreflang 用 `zh-Hans`（脚本码，语义是「简体中文」）而非 `zh-CN`（地区码）。

---

## 七、调研过程中被推翻的说法

记录在此以免日后重复踩坑：

| 说法 | 核实结果 |
|---|---|
| React 19.2 提供 `<ViewTransition>` | ✗ 实测 react 19.2.8 无此导出 |
| Next 16 把 `middleware.ts` 改名 `proxy.ts` | ✗ 装好的包里仍是 `middleware` |
| `@supports (backdrop-filter: url(#x))` 可用于降级检测 | ✗ 假阳性，Firefox/Safari 都返回 true 却不渲染 |
| `transform: translateZ(0)` 会破坏 backdrop-filter | ✗ 实测无害，真正的杀手是 `opacity` 和 `filter` |
| CJK 可变字体比静态字重省体积 | ✗ 恰恰相反，约等于 1.9 个静态字重 |
| 2026 年 Core Web Vitals 有新指标/新阈值 | ✗ 无官方来源，阈值自 2024 未变 |
| `next/image` 用 `priority` 标记首屏图 | ✗ Next 16 已弃用，源码里明确 `@deprecated Use preload prop instead` |

被证实的：`cacheComponents` 确实已取代 `experimental.ppr` 成为顶层配置；`priority` 确实已弃用。
