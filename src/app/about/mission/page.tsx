import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "使命与愿景",
};

export default function Page() {
  return <PageShell path="/about/mission" />;
}
