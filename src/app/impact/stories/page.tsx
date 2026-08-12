import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "一线故事",
};

export default function Page() {
  return <PageShell path="/impact/stories" />;
}
