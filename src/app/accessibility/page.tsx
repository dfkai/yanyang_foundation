import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "无障碍声明",
};

export default function Page() {
  return <PageShell path="/accessibility" />;
}
