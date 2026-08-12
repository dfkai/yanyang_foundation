import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "合作伙伴",
};

export default function Page() {
  return <PageShell path="/about/partners" />;
}
