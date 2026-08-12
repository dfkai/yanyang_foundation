import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "使用条款",
};

export default function Page() {
  return <PageShell path="/terms" />;
}
