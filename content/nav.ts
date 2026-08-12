import { features } from "./site";

export type NavItem = {
  label: string;
  href: string;
  /** 二级栏目，用于页脚站点地图与未来的下拉菜单 */
  children?: { label: string; href: string }[];
};

/**
 * 一级导航
 * ---------------------------------------------------------------------------
 * 标杆站的一级导航普遍在 3–8 项（盖茨基金会 3 项、维基媒体 4 项、壹基金 6 项、
 * 中国乡村发展基金会 8 项），超过 8 项在移动端会崩。
 *
 * 「信息公开」必须占一级导航位置 —— 三家中国大陆标杆基金会全部如此，
 * 这是中国大陆慈善组织官网与欧美站最大的信息架构差异。
 */
export const primaryNav: NavItem[] = [
  {
    label: "关于我们",
    href: "/about",
    children: [
      { label: "机构介绍", href: "/about" },
      { label: "使命与愿景", href: "/about/mission" },
      { label: "理事长致辞", href: "/about/chairman" },
      { label: "理事会与监事", href: "/about/council" },
      { label: "秘书处团队", href: "/about/team" },
      { label: "发展历程", href: "/about/history" },
      { label: "合作伙伴", href: "/about/partners" },
    ],
  },
  { label: "公益项目", href: "/programs" },
  {
    label: "影响力",
    href: "/impact",
    children: [
      { label: "影响力总览", href: "/impact" },
      { label: "一线故事", href: "/impact/stories" },
    ],
  },
  {
    label: "信息公开",
    href: "/disclosure",
    children: [
      { label: "公开总览", href: "/disclosure" },
      { label: "章程与内部制度", href: "/disclosure/charter" },
      { label: "年度工作报告", href: "/disclosure/annual-report" },
      { label: "财务与审计报告", href: "/disclosure/financial" },
      { label: "慈善项目信息", href: "/disclosure/projects" },
      { label: "重要关联方交易", href: "/disclosure/related-party" },
      { label: "投诉与举报", href: "/disclosure/complaints" },
    ],
  },
  { label: "新闻动态", href: "/news" },
  {
    label: features.hasPublicFundraising ? "加入我们" : "支持我们",
    href: "/support",
    children: [
      { label: "合作与支持", href: "/support" },
      { label: "企业合作", href: "/support/corporate" },
      { label: "志愿者", href: "/support/volunteer" },
      { label: "加入团队", href: "/careers" },
    ],
  },
  { label: "联系我们", href: "/contact" },
];

/**
 * 主行动号召。
 * 无公开募捐资格时绝不能出现「我要捐赠」这类面向不特定公众的募捐入口 ——
 * 那构成违法公开募捐（见 content/site.ts 里 features 的说明）。
 */
export const primaryCta = features.hasPublicFundraising
  ? { label: "我要捐赠", href: "/donate" }
  : { label: "了解我们的项目", href: "/programs" };

/**
 * 页脚导航
 * ---------------------------------------------------------------------------
 * 早先这里直接把 primaryNav 连同全部二级栏目铺开，结果是 27 条链接、
 * 1137px 高 —— 比一屏还高，读者只会跳过。
 *
 * 页脚不是站点地图的副本。它按**来到页脚的人想做什么**分组，每组只留四条
 * 最常被找的：想了解机构、想看我们做了什么、想查账、想联系或参与。
 * 其余入口在一级导航里都有，不必在页脚重复一遍。
 */
export const footerNav: { title: string; items: { label: string; href: string }[] }[] = [
  {
    title: "了解本会",
    items: [
      { label: "机构介绍", href: "/about" },
      { label: "理事会与监事", href: "/about/council" },
      { label: "发展历程", href: "/about/history" },
      { label: "加入团队", href: "/careers" },
    ],
  },
  {
    title: "我们的工作",
    items: [
      { label: "公益项目", href: "/programs" },
      { label: "影响力", href: "/impact" },
      { label: "一线故事", href: "/impact/stories" },
      { label: "新闻动态", href: "/news" },
    ],
  },
  {
    title: "信息公开",
    items: [
      { label: "年度工作报告", href: "/disclosure/annual-report" },
      { label: "财务与审计报告", href: "/disclosure/financial" },
      { label: "章程与内部制度", href: "/disclosure/charter" },
      { label: "投诉与举报", href: "/disclosure/complaints" },
    ],
  },
  {
    title: "参与和联系",
    items: [
      { label: "支持我们", href: "/support" },
      { label: "企业合作", href: "/support/corporate" },
      { label: "志愿者", href: "/support/volunteer" },
      { label: "联系我们", href: "/contact" },
    ],
  },
];

/** 页脚的法务与政策链接 */
export const legalNav: NavItem[] = [
  { label: "隐私政策", href: "/privacy" },
  { label: "使用条款", href: "/terms" },
  { label: "无障碍声明", href: "/accessibility" },
];
