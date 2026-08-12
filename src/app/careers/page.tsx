import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "加入团队",
};

export default function Page() {
  return <PageShell path="/careers" />;
}
