import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "秘书处团队",
};

export default function Page() {
  return <PageShell path="/about/team" />;
}
