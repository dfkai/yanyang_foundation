import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "年度工作报告",
};

export default function Page() {
  return <PageShell path="/disclosure/annual-report" />;
}
