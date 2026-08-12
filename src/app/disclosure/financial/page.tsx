import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "财务会计与审计报告",
};

export default function Page() {
  return <PageShell path="/disclosure/financial" />;
}
