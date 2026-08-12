import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "联系我们",
};

export default function Page() {
  return <PageShell path="/contact" />;
}
