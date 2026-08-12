import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "发展历程",
};

export default function Page() {
  return <PageShell path="/about/history" />;
}
