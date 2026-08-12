# 艳阳基金会官方网站

Next.js 16 + Tailwind CSS 4，中文优先，视觉方向为「暖阳浅底 + Apple 液态玻璃」。

- 设计与技术决策的依据：[`docs/RESEARCH.md`](docs/RESEARCH.md)
- **需要基金会提供的材料清单：[`docs/CONTENT-CHECKLIST.md`](docs/CONTENT-CHECKLIST.md)** ← 内容负责人看这份

---

## 本地开发

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

其它命令：

```bash
pnpm check:content  # 列出还有哪些事实性内容没填
pnpm font:build     # 重新生成中文标题字体子集（改了文案后跑一次）
pnpm lint
pnpm build          # 生产构建，占位内容没填完会主动失败
pnpm build:preview  # 跳过占位检查的构建，用于内容齐备前的预览部署
```

---

## 改内容不用碰代码

所有文案集中在 `content/` 目录，改这里就行：

| 文件 | 内容 |
|---|---|
| `content/site.ts` | 机构名称、法定信息、联系方式、备案号、**是否有公开募捐资格** |
| `content/home.ts` | 首页各区块文案与数据 |
| `content/pages.ts` | 各栏目页的标题、引导语、待填说明 |
| `content/nav.ts` | 导航结构 |

在 GitHub 网页上直接编辑这些文件并提交，Vercel 会自动重新部署。

### 两种占位标记的区别

| 标记 | 含义 | 站内表现 | 阻塞上线 |
|---|---|---|---|
| `TODO_FOUNDATION_INPUT:...` | 事实性内容，只能由基金会提供 | 黄色高亮块 | **是** |
| `DRAFT:...`（由 `draft()` 生成） | 起草的表述性文案，可直接改 | 正常显示，开发时有虚线 | 否 |

这个区分是刻意的：在慈善机构官网上编造数字、资质或合作方，触及《慈善法》第 111 条的虚假宣传，最重可吊销登记证书。详见内容清单。

### 改完文案记得跑一次字体

标题字体是按站内**实际用字**做的子集。加了新的标题文案后：

```bash
pnpm font:build
```

`pnpm build` 会自动跑这一步，所以只在本地 dev 时需要手动执行。

---

## 项目结构

```
content/               所有文案与配置（非技术同事改这里）
docs/                  调研记录与内容清单
scripts/
  subset-fonts.mjs     中文字体子集化
  check-placeholders.mjs  上线守卫：拦截未替换的占位内容
assets/                字体源文件与字表（不进构建产物）
src/
  app/                 路由（App Router）
    globals.css        设计系统：色板、排版、玻璃材质、无障碍降级
    fonts.ts           标题字体配置
  components/
    ui/                按钮、区块容器等基础件
    site-header.tsx    玻璃导航（全站唯一常驻的玻璃元素）
    site-footer.tsx    合规页脚
    page-shell.tsx     栏目页骨架
    fact.tsx           内容渲染器（区分事实/起草文案）
    sun-field.tsx      首屏暖阳光场（纯 CSS，零图片）
    brand-mark.tsx     临时标识 ← 拿到正式 VI 后只改这一个文件
```

---

## 部署：GitHub → Vercel → 域名

### 1. 推到 GitHub 私有库

```bash
git add -A
git commit -m "初始化艳阳基金会官网"
gh repo create yanyang-foundation --private --source=. --remote=origin --push
```

### 2. 接入 Vercel

1. 登录 <https://vercel.com>，New Project → Import Git Repository
2. 选中刚创建的仓库，框架会自动识别为 Next.js，**不需要在网页上改任何构建配置**

构建配置写在仓库里的 [`vercel.json`](vercel.json)，不放在 Vercel 网页设置里 —— 网页上那个 Override 开关忘记打开是最常见的部署失败原因，而且换台机器、重建项目就得重配一次。

这个文件目前是**预览模式**的开关，两项内容一体：

| 字段 | 作用 |
|---|---|
| `buildCommand: pnpm build:preview` | 跳过占位守卫，内容未齐也能构建出站点 |
| `NEXT_PUBLIC_DEMO: "1"` | 渲染 `content/demo-pages.ts` 的示意内容，让版式可被评估 |

**内容齐备、准备正式上线时，直接删掉 `vercel.json` 整个文件**，一步切回生产模式：构建走带占位守卫的 `pnpm build`，示意内容不再渲染。两个开关绑在一起是刻意的 —— 避免出现「守卫关了但演示数据还在」这类半吊子状态上线。

> 预览部署期间务必在 Settings → Deployment Protection 开启密码保护。示意内容里有「91××××××」这类形似统一社会信用代码的占位值，慈善机构官网被搜索引擎收录到这些内容，解释成本很高。

### 3. 绑定域名

在 Vercel 项目的 Settings → Domains 添加域名，它会给出需要配置的 DNS 记录，形如：

| 类型 | 名称 | 值 |
|---|---|---|
| A | `@` | Vercel 给出的 IP |
| CNAME | `www` | `cname.vercel-dns.com` |

到域名注册商后台的「DNS 解析」里添加这两条，等 10 分钟到几小时生效，HTTPS 证书 Vercel 自动配。

**两个注意事项：**

- 若面向中国大陆访问，把 CNAME 指向 `cname-china.vercel-dns.com`（Vercel 的中国优化入口，零成本）
- **不要用 .cn 域名指向 Vercel** —— .cn 未备案会被停止解析，而 Vercel 无法办理 ICP 备案

### 4. 上线前

- [ ] `content/site.ts` 里的 `url` 填成正式域名（metadata、sitemap、OG 图都依赖它）
- [ ] `pnpm build` 通过（即所有事实性内容已填）
- [ ] 提交 sitemap 到 Google Search Console 与百度搜索资源平台
- [ ] 网站开通后 30 日内办理公安联网备案（如已 ICP 备案）
- [ ] 核对官网信息与「慈善中国」平台公示内容一致
