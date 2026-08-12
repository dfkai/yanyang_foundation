/**
 * 站点级常量与机构事实
 * ---------------------------------------------------------------------------
 * ⚠️ 凡是以 TODO_FOUNDATION_INPUT 开头的值，都必须由基金会提供真实信息后替换。
 *
 * 这不是普通的「示例数据待填」。《慈善法》第 111 条规定，以虚假宣传、虚构事实
 * 等方式欺骗、诱导募捐对象的，可责令停止募捐、退还财产，情节严重的吊销登记
 * 证书，被吊销公开募捐资格证书的 5 年内不得再次申请。也就是说，在慈善机构官网
 * 上编造一个数字，性质与在普通商业站放占位文案完全不同。
 *
 * scripts/check-placeholders.mjs 会在生产构建时扫描这些标记，未替换则构建失败。
 */

export const TODO = "TODO_FOUNDATION_INPUT" as const;

/** 便捷判断：某个字段是否还是未填的占位 */
export const isPlaceholder = (v: string): boolean => v.startsWith(TODO);

/**
 * 起草文案标记
 * ---------------------------------------------------------------------------
 * 与 TODO 的区别很重要，两者不能混：
 *
 *   TODO_FOUNDATION_INPUT  事实性内容 —— 数字、资质、人名、项目、合作方、
 *                          日期、金额。这些只能由基金会提供，AI 不得编造，
 *                          生产构建会被 check-placeholders.mjs 直接拦截。
 *
 *   DRAFT                  表述性文案 —— 口号、栏目引导语、说明文字。这些
 *                          由我起草以保证页面可读、版式成立，不构成任何事实
 *                          声明，基金会审阅替换即可，不阻塞上线。
 *
 * 之所以做这个区分：慈善机构官网上编造事实触及《慈善法》第 111 条的虚假
 * 宣传，而写一句「让每一份善意都被看见」不是。把两者混作「占位内容」会
 * 让真正危险的那一类失去警示。
 */
export const DRAFT = "DRAFT" as const;

/** 标记一段由我起草、待基金会审阅的表述性文案 */
export const draft = (text: string): string => `${DRAFT}:${text}`;

export const isDraft = (v: string): boolean => v.startsWith(`${DRAFT}:`);

/** 取出可直接展示的文本（自动剥掉 DRAFT 前缀） */
export const textOf = (v: string): string =>
  isDraft(v) ? v.slice(DRAFT.length + 1) : v;


/**
 * 待填内容槽
 * ---------------------------------------------------------------------------
 * 一个位置同时携带两样东西：待基金会填写的说明，以及一段**演示内容**。
 *
 * 演示内容存在的唯一目的是让视觉方案能被评估 —— 满屏黄色警告块的页面没法
 * 判断好不好看。它只在 NEXT_PUBLIC_DEMO=1 时渲染（`pnpm dev:demo`），
 * 默认开发与生产构建都不会出现，构建守卫照旧拦截未填内容。
 *
 * 演示内容一律是明显的示意值，不得被误认为基金会的真实数据。
 */
export type Slot = { todo: string; demo: string };

export const slot = (label: string, demo: string): Slot => ({
  todo: TODO + ":" + label,
  demo,
});

export const isSlot = (v: unknown): v is Slot =>
  typeof v === "object" && v !== null && "todo" in v && "demo" in v;

export const site = {
  name: "艳阳基金会",
  nameEn: "Yanyang Foundation",

  /** 一句话使命。基金会确认后替换。 */
  tagline: "TODO_FOUNDATION_INPUT:一句话使命（例：把一份心意，投向乡村的教育与医疗）",

  /** 用于 metadata / OG / 结构化数据的机构简介，80–160 字。 */
  description: "TODO_FOUNDATION_INPUT:机构简介（80–160 字。家族办公室下设的慈善基金，关注乡村教育与儿童医疗）",

  /**
   * 站点正式域名。metadataBase、sitemap、robots、OG 图、JSON-LD 全部依赖它，
   * 一旦上线后更换对 SEO 是重创 —— 请在上线前确定。
   */
  url: "TODO_FOUNDATION_INPUT:正式域名（例：https://yanyang.org）",

  /** 站点语言。zh-Hans 是脚本码（简体中文），比地区码 zh-CN 语义更正确。 */
  locale: "zh-Hans",
} as const;

/**
 * 机构法定信息 —— 全部需要基金会提供真实凭据，一项都不能先写上去等以后补。
 */
export const foundation = {
  /** 民政部门登记的全称，可能与对外简称不同 */
  legalName: "TODO_FOUNDATION_INPUT:登记全称（例：北京市艳阳公益基金会）",
  /** 统一社会信用代码（18 位） */
  unifiedSocialCreditCode: "TODO_FOUNDATION_INPUT:统一社会信用代码",
  /** 登记管理机关（例：北京市民政局） */
  registrationAuthority: "TODO_FOUNDATION_INPUT:登记管理机关",
  /** 成立日期 YYYY-MM-DD */
  foundingDate: "TODO_FOUNDATION_INPUT:成立日期",
  /** 「慈善中国」全国慈善信息公开平台上本机构的公示页 URL */
  charityChinaUrl: "TODO_FOUNDATION_INPUT:慈善中国主体公示页 URL",
  /** 业务主管单位（如有） */
  supervisoryUnit: "TODO_FOUNDATION_INPUT:业务主管单位（如无可填「无」）",

  /** 联系方式 */
  address: "TODO_FOUNDATION_INPUT:办公地址",
  postalCode: "TODO_FOUNDATION_INPUT:邮政编码",
  phone: "TODO_FOUNDATION_INPUT:联系电话",
  email: "TODO_FOUNDATION_INPUT:联系邮箱",
  /** 投诉举报渠道 —— 中国大陆基金会官网的惯例栏目 */
  complaintPhone: "TODO_FOUNDATION_INPUT:投诉举报电话",
  complaintEmail: "TODO_FOUNDATION_INPUT:投诉举报邮箱",

  /** 网站备案。ICP 备案要求接入商与服务器在境内，海外托管无法备案。 */
  icpBeian: "TODO_FOUNDATION_INPUT:ICP 备案号（若未备案留空字符串）",
  /** 公安联网备案须在网站开通后 30 日内办理 */
  gonganBeian: "TODO_FOUNDATION_INPUT:公安网安备号",

  /** 审计机构名称（财务报告页展示） */
  auditFirm: "TODO_FOUNDATION_INPUT:审计机构名称",
  /** 公益性捐赠税前扣除资格的年度与文号 */
  taxDeduction: "TODO_FOUNDATION_INPUT:税前扣除资格年度与文号（如无填「暂未取得」）",

  /** 官方账号，用于结构化数据的 sameAs */
  social: {
    weibo: "",
    wechat: "",
    douyin: "",
  },
} as const;

/**
 * 功能开关 —— 决定整站信息架构的唯一分叉点。
 * ---------------------------------------------------------------------------
 * hasPublicFundraising = 基金会是否持有《慈善组织公开募捐资格证书》。
 *
 * 若为 false（新设立的基金会大概率如此），官网上任何面向不特定公众的捐赠入口
 * 都可能被认定为违法公开募捐（《慈善法》第 22 条，依法登记满一年方可申请资格；
 * 违规可处警告、责令停止、责令退还，情节严重罚款 2 万至 20 万元）。
 *
 * 因此默认取 false，走「使命 → 项目 → 影响力 → 信息公开」的非公募范式
 * （对应盖茨基金会 / 南都公益基金会的做法，两者一级导航里都没有捐赠入口）。
 * 拿到资格后把它翻成 true，导航与首页 CTA 会自动切换到公募范式。
 */
export const features = {
  hasPublicFundraising: false,
} as const;
