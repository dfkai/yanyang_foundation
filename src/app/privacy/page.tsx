import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "隐私政策",
};

export default function Page() {
  return <PageShell path="/privacy" />;
}
