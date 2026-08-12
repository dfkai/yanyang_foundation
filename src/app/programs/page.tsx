import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "公益项目",
};

export default function Page() {
  return <PageShell path="/programs" />;
}
