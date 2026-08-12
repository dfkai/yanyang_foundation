import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "新闻动态",
};

export default function Page() {
  return <PageShell path="/news" />;
}
